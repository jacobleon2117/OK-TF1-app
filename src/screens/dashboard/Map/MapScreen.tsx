import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Text, StatusBar, Alert, Platform, Linking, Image, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline, MapMarker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation';
import { ScreenHeader, BottomNavigation } from '@/components/common/dashboard';
import { DASHBOARD_NAV_ITEMS } from '@/constants/navigation';
import { collection, doc, setDoc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/hooks/useAuth';

type NavigationProp = StackNavigationProp<RootStackParamList>;

// Marker types
const MARKER_TYPES = {
  TEAM_MEMBER: 'teamMember',
  BROKEN_HOUSE: 'brokenHouse',
  FLOODED_HOUSE: 'floodedHouse',
  BOAT: 'boat',
  FIRE: 'fire',
  DEAD_BODY: 'deadBody',
  RESCUED_PEOPLE: 'rescuedPeople',
};

interface Direction {
  lat: number;
  lng: number;
}

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface MarkerData {
  id: string;
  type: string;
  title: string;
  description: string;
  coordinate: Coordinate;
  isTracked?: boolean;
  direction?: Direction;
  route?: Coordinate[];
}

// Helper function to generate random direction
const getRandomDirection = (): Direction => {
  const angle = Math.random() * Math.PI * 2; // Random angle in radians
  const speed = 0.00005; // Reduced speed by half (from 0.0001)
  return {
    lat: Math.sin(angle) * speed,
    lng: Math.cos(angle) * speed,
  };
};

// Helper function to generate initial route points
const generateInitialRoute = (startCoord: Coordinate, count: number = 20): Coordinate[] => {
  const route: Coordinate[] = [];
  for (let i = 0; i < count; i++) {
    route.push({ ...startCoord });
  }
  return route;
};

// Helper function to check if a coordinate is near another
const isNearCoordinate = (coord1: Coordinate, coord2: Coordinate, threshold: number = 0.001): boolean => {
  const latDiff = Math.abs(coord1.latitude - coord2.latitude);
  const lngDiff = Math.abs(coord1.longitude - coord2.longitude);
  return latDiff < threshold && lngDiff < threshold;
};

// Helper function to generate random offset within a square mile
const getRandomOffset = (base: number): number => {
  // 1 square mile is approximately 0.0145 degrees
  const squareMileInDegrees = 0.0145;
  return base + (Math.random() - 0.5) * squareMileInDegrees;
};

// Initial marker positions
const INITIAL_MARKERS: MarkerData[] = [
  {
    id: '1',
    type: MARKER_TYPES.TEAM_MEMBER,
    title: 'Team Member 1',
    description: 'On active mission',
    coordinate: {
      latitude: 36.1540,
      longitude: -95.9928,
    },
    isTracked: true,
    direction: getRandomDirection(),
    route: generateInitialRoute({ latitude: 36.1540, longitude: -95.9928 }),
  },
  {
    id: '2',
    type: MARKER_TYPES.TEAM_MEMBER,
    title: 'Team Member 2',
    description: 'Searching area',
    coordinate: {
      latitude: 36.1550,
      longitude: -95.9918,
    },
    direction: getRandomDirection(),
    route: generateInitialRoute({ latitude: 36.1550, longitude: -95.9918 }),
  },
  {
    id: '3',
    type: MARKER_TYPES.BROKEN_HOUSE,
    title: 'Damaged Structure',
    description: 'Severe structural damage',
    coordinate: {
      latitude: getRandomOffset(36.1530),
      longitude: getRandomOffset(-95.9938),
    },
  },
  {
    id: '4',
    type: MARKER_TYPES.FLOODED_HOUSE,
    title: 'Flooded Building',
    description: 'Water level: 2m',
    coordinate: {
      latitude: getRandomOffset(36.1520),
      longitude: getRandomOffset(-95.9948),
    },
  },
  {
    id: '5',
    type: MARKER_TYPES.BOAT,
    title: 'Rescue Boat',
    description: 'Available for evacuation',
    coordinate: {
      latitude: getRandomOffset(36.1510),
      longitude: getRandomOffset(-95.9958),
    },
  },
  {
    id: '6',
    type: MARKER_TYPES.FIRE,
    title: 'Active Fire',
    description: 'Fire department en route',
    coordinate: {
      latitude: getRandomOffset(36.1500),
      longitude: getRandomOffset(-95.9968),
    },
  },
  {
    id: '7',
    type: MARKER_TYPES.DEAD_BODY,
    title: 'Casualty',
    description: 'Requires recovery',
    coordinate: {
      latitude: getRandomOffset(36.1490),
      longitude: getRandomOffset(-95.9978),
    },
  },
  {
    id: '8',
    type: MARKER_TYPES.RESCUED_PEOPLE,
    title: 'Evacuation Point',
    description: '5 people awaiting transport',
    coordinate: {
      latitude: getRandomOffset(36.1480),
      longitude: getRandomOffset(-95.9988),
    },
  },
];

// Import the image at the top level
const personMarker = require('../../../../assets/images/person.png');

// Default coordinates
const DEFAULT_LOCATION = {
  latitude: 36.15613,
  longitude: -95.99497,
};

const MapScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [markers, setMarkers] = useState<MarkerData[]>(INITIAL_MARKERS);
  const [realTimeUsers, setRealTimeUsers] = useState<{ [key: string]: MarkerData }>({});
  const markerRef = React.useRef<MapMarker>(null);
  const mapRef = React.useRef<MapView>(null);

  const openSettings = async () => {
    if (Platform.OS === 'ios') {
      await Linking.openURL('app-settings:');
    } else {
      await Linking.openSettings();
    }
  };

  const checkLocationServices = async () => {
    try {
      // Check if location services are enabled
      const enabled = await Location.hasServicesEnabledAsync();
      console.log('Location services enabled:', enabled);
      
      if (!enabled) {
        Alert.alert(
          'Location Services Disabled',
          'Please enable location services in your device settings to use this feature.',
          [
            {
              text: 'Open Settings',
              onPress: openSettings,
            },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
        return false;
      }
      return true;
    } catch (err) {
      console.error('Error checking location services:', err);
      return false;
    }
  };

  const getLocation = async () => {
    try {
      console.log('Checking location services...');
      const servicesEnabled = await checkLocationServices();
      if (!servicesEnabled) {
        setError('Location services are disabled');
        return;
      }

      console.log('Requesting location permissions...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('Location permission status:', status);

      if (status !== 'granted') {
        const errorMsg = 'Permission to access location was denied';
        console.log(errorMsg);
        setError(errorMsg);
        Alert.alert(
          'Location Permission Required',
          'Please enable location permissions in your device settings to use this feature.',
          [
            {
              text: 'Open Settings',
              onPress: openSettings,
            },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
        return;
      }

      console.log('Getting current position...');
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
      });
      console.log('Current position:', currentLocation);
      setLocation(currentLocation);
    } catch (err) {
      const errorMsg = 'Failed to get location: ' + (err as Error).message;
      console.error(errorMsg);
      setError(errorMsg);
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please check your location settings.',
        [{ text: 'OK' }]
      );
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      // Set user location to specific Tulsa coordinates
      setLocation({
        coords: {
          latitude: 36.15525,
          longitude: -95.99409,
          altitude: null,
          accuracy: 5,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      });
    })();
  }, []);

  // Track real user location in Firestore
  useEffect(() => {
    if (!user) return;

    const updateUserLocation = async (newLocation: Location.LocationObject) => {
      try {
        // Update in teamLocations collection
        const teamLocationRef = doc(db, 'teamLocations', user.uid);
        await setDoc(teamLocationRef, {
          location: {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          },
          timestamp: new Date().toISOString(),
          userId: user.uid,
          name: user.displayName || 'Team Member',
          status: 'active'
        });

        // Update in user's location subcollection
        const userLocationRef = doc(db, `users/${user.uid}/location/current`);
        await setDoc(userLocationRef, {
          latitude: newLocation.coords.latitude,
          longitude: newLocation.coords.longitude,
          timestamp: new Date().toISOString(),
          accuracy: newLocation.coords.accuracy
        });
      } catch (error) {
        console.error('Error updating user location:', error);
      }
    };

    if (location) {
      updateUserLocation(location);
    }
  }, [location, user]);

  // Listen for real-time user updates from Firestore
  useEffect(() => {
    if (!user) return;

    // Listen to teamLocations collection
    const teamLocationsRef = collection(db, 'teamLocations');
    
    const unsubscribe = onSnapshot(teamLocationsRef, (snapshot) => {
      const users: { [key: string]: MarkerData } = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (doc.id !== user.uid && data.location) { // Don't include current user
          users[doc.id] = {
            id: doc.id,
            type: MARKER_TYPES.TEAM_MEMBER,
            title: data.name || 'Team Member',
            description: `Last updated: ${new Date(data.timestamp).toLocaleTimeString()}`,
            coordinate: data.location,
            route: [data.location],
          };
        }
      });
      setRealTimeUsers(users);
    });

    return () => unsubscribe();
  }, [user]);

  // Effect to show callout when location is set
  useEffect(() => {
    if (location && markerRef.current) {
      // Small delay to ensure marker is rendered
      setTimeout(() => {
        markerRef.current?.showCallout();
      }, 1000);
    }
  }, [location]);

  const handleBackNavigation = () => {
    navigation.goBack();
  };

  const getMarkerColor = (type: string, isTracked?: boolean) => {
    if (isTracked) return '#FF0000'; // Red for tracked team member
    switch (type) {
      case MARKER_TYPES.TEAM_MEMBER:
        return '#00FF00'; // Green for team members
      case MARKER_TYPES.BROKEN_HOUSE:
        return '#FFA500'; // Orange for broken houses
      case MARKER_TYPES.FLOODED_HOUSE:
        return '#0000FF'; // Blue for flooded houses
      case MARKER_TYPES.BOAT:
        return '#FFFF00'; // Yellow for boats
      case MARKER_TYPES.FIRE:
        return '#FF0000'; // Red for fires
      case MARKER_TYPES.DEAD_BODY:
        return '#800000'; // Dark red for casualties
      case MARKER_TYPES.RESCUED_PEOPLE:
        return '#008000'; // Dark green for rescued people
      default:
        return '#FF8C00'; // Default orange
    }
  };

  const getMarkerImage = (type: string) => {
    switch (type) {
      case MARKER_TYPES.TEAM_MEMBER:
        return require('../../../../assets/images/teamMember.png');
      case MARKER_TYPES.BROKEN_HOUSE:
        return require('../../../../assets/images/damagedStructure.png');
      case MARKER_TYPES.FLOODED_HOUSE:
        return require('../../../../assets/images/floodedBuilding.png');
      case MARKER_TYPES.BOAT:
        return require('../../../../assets/images/rescueBoat.png');
      case MARKER_TYPES.FIRE:
        return require('../../../../assets/images/activeFire.png');
      case MARKER_TYPES.DEAD_BODY:
        return require('../../../../assets/images/casualty.png');
      case MARKER_TYPES.RESCUED_PEOPLE:
        return require('../../../../assets/images/evacuationPoint.png');
      default:
        return require('../../../../assets/images/teamMember.png');
    }
  };

  // Function to update marker positions
  const updateMarkerPositions = () => {
    setMarkers(prevMarkers => 
      prevMarkers.map(marker => {
        if (marker.type === MARKER_TYPES.TEAM_MEMBER && marker.direction) {
          // 10% chance to change direction each update (reduced from 30%)
          const shouldChangeDirection = Math.random() < 0.1;
          
          // If changing direction, make it more purposeful
          let currentDirection = marker.direction;
          if (shouldChangeDirection) {
            // Get other team members' positions
            const otherMembers = prevMarkers.filter(m => 
              m.type === MARKER_TYPES.TEAM_MEMBER && 
              m.id !== marker.id
            );

            // If near another team member, move away
            const isNearOtherMember = otherMembers.some(other => 
              isNearCoordinate(marker.coordinate, other.coordinate)
            );

            if (isNearOtherMember) {
              // Move away from the nearest team member
              const nearestMember = otherMembers.reduce((nearest, current) => {
                const nearestDist = Math.abs(nearest.coordinate.latitude - marker.coordinate.latitude) +
                                 Math.abs(nearest.coordinate.longitude - marker.coordinate.longitude);
                const currentDist = Math.abs(current.coordinate.latitude - marker.coordinate.latitude) +
                                  Math.abs(current.coordinate.longitude - marker.coordinate.longitude);
                return currentDist < nearestDist ? current : nearest;
              });

              const angle = Math.atan2(
                marker.coordinate.latitude - nearestMember.coordinate.latitude,
                marker.coordinate.longitude - nearestMember.coordinate.longitude
              );

              currentDirection = {
                lat: Math.sin(angle) * 0.00005,
                lng: Math.cos(angle) * 0.00005,
              };
            } else {
              // Otherwise, continue in a similar direction with slight variation
              const angle = Math.atan2(marker.direction.lat, marker.direction.lng);
              const variation = (Math.random() - 0.5) * Math.PI / 4; // ±45 degrees
              currentDirection = {
                lat: Math.sin(angle + variation) * 0.00005,
                lng: Math.cos(angle + variation) * 0.00005,
              };
            }
          }

          // Update coordinates based on direction
          const newLat = marker.coordinate.latitude + currentDirection.lat;
          const newLng = marker.coordinate.longitude + currentDirection.lng;
          
          // Reverse direction if reaching map boundaries
          const newDirection = {
            lat: (newLat > 36.16 || newLat < 36.15) ? -currentDirection.lat : currentDirection.lat,
            lng: (newLng > -95.99 || newLng < -96.0) ? -currentDirection.lng : currentDirection.lng,
          };

          // Add new position to route - no limit on length
          const newRoute = [...(marker.route || []), { latitude: newLat, longitude: newLng }];

          return {
            ...marker,
            coordinate: {
              latitude: newLat,
              longitude: newLng,
            },
            direction: newDirection,
            route: newRoute,
          };
        }
        return marker;
      })
    );
  };

  // Set up interval for marker movement
  useEffect(() => {
    const interval = setInterval(updateMarkerPositions, 1000); // Update every second
    return () => clearInterval(interval);
  }, []);

  // Get real-time location updates
  useEffect(() => {
    let locationSubscription: Location.LocationSubscription;

    const startLocationUpdates = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission to access location was denied');
          return;
        }

        // Get initial location
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High
        });
        setLocation(currentLocation);

        // Center map on current location
        if (mapRef.current && currentLocation) {
          mapRef.current.animateToRegion({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.0005,
            longitudeDelta: 0.0005,
          }, 1000);
        }

        // Subscribe to location updates
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 1
          },
          (newLocation) => {
            setLocation(newLocation);
          }
        );
      } catch (err: any) {
        setError('Error getting location: ' + (err?.message || 'Unknown error'));
      }
    };

    startLocationUpdates();

    // Cleanup subscription on unmount
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location?.coords.latitude || DEFAULT_LOCATION.latitude,
        longitude: location?.coords.longitude || DEFAULT_LOCATION.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location?.coords.latitude || DEFAULT_LOCATION.latitude,
        longitude: location?.coords.longitude || DEFAULT_LOCATION.longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      }, 1000);
    }
  };

  const handleGetDirections = (coordinate: { latitude: number; longitude: number }) => {
    const { latitude, longitude } = coordinate;
    console.log('Getting directions to:', { latitude, longitude });
    
    const url = Platform.select({
      ios: `maps://app?saddr=&daddr=${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}`,
    });

    console.log('Opening URL:', url);

    if (url) {
      Linking.canOpenURL(url)
        .then(supported => {
          if (supported) {
            return Linking.openURL(url);
          } else {
            console.error('Cannot open URL:', url);
            Alert.alert('Error', 'No maps application available');
          }
        })
        .catch(err => {
          console.error('Error opening maps:', err);
          Alert.alert('Error', 'Could not open maps application');
        });
    } else {
      console.error('No URL generated for platform:', Platform.OS);
      Alert.alert('Error', 'Directions not supported on this platform');
    }
  };

  if (error) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ScreenHeader title="Map" onBack={handleBackNavigation} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.helpText}>
            Please ensure that:
            {'\n'}1. Location services are enabled on your device
            {'\n'}2. The app has permission to access your location
            {'\n'}3. You are in an area with good GPS signal
          </Text>
        </View>
        <BottomNavigation navigation={navigation} currentScreen="Map" items={DASHBOARD_NAV_ITEMS} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScreenHeader title="Mission Map" onBack={handleBackNavigation} />
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={{
            latitude: location?.coords.latitude || DEFAULT_LOCATION.latitude,
            longitude: location?.coords.longitude || DEFAULT_LOCATION.longitude,
            latitudeDelta: 0.0922,  // This will show a larger area
            longitudeDelta: 0.0421,  // This will show a larger area
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
          followsUserLocation={true}
        >
          {/* Current user's location with custom marker */}
          {location && (
            <Marker
              ref={markerRef}
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="You are here"
              description="Your current location"
              onPress={() => Alert.alert(
                'Get Directions',
                'Would you like to get directions to this location?',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Get Directions',
                    onPress: () => handleGetDirections({
                      latitude: location.coords.latitude,
                      longitude: location.coords.longitude,
                    }),
                  },
                ],
              )}
            >
              <Image
                source={require('../../../../assets/images/person.png')}
                style={{ width: 120, height: 120 }}
                resizeMode="contain"
              />
            </Marker>
          )}

          {/* Simulated markers */}
          {markers.map((marker) => (
            <React.Fragment key={marker.id}>
              {marker.type === MARKER_TYPES.TEAM_MEMBER && marker.route && (
                <Polyline
                  coordinates={marker.route}
                  strokeColor={marker.isTracked ? "#FF0000" : "#00FF00"}
                  strokeWidth={3}
                />
              )}
              <Marker
                coordinate={marker.coordinate}
                title={marker.title}
                description={marker.description}
                image={getMarkerImage(marker.type)}
                tracksViewChanges={false}
                onPress={() => Alert.alert(
                  'Get Directions',
                  `Would you like to get directions to ${marker.title}?`,
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Get Directions',
                      onPress: () => handleGetDirections(marker.coordinate),
                    },
                  ],
                )}
              />
            </React.Fragment>
          ))}

          {/* Real-time Firestore markers */}
          {Object.values(realTimeUsers).map((user) => (
            <React.Fragment key={user.id}>
              {user.route && (
                <Polyline
                  coordinates={user.route}
                  strokeColor="#0000FF"
                  strokeWidth={3}
                />
              )}
              <Marker
                coordinate={user.coordinate}
                title={user.title}
                description={user.description}
                image={require('../../../../assets/images/teamMember.png')}
                tracksViewChanges={false}
                onPress={() => Alert.alert(
                  'Get Directions',
                  `Would you like to get directions to ${user.title}?`,
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Get Directions',
                      onPress: () => handleGetDirections(user.coordinate),
                    },
                  ],
                )}
              />
            </React.Fragment>
          ))}
        </MapView>
        <View style={styles.zoomControls}>
          <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
            <Text style={styles.zoomButtonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
            <Text style={styles.zoomButtonText}>-</Text>
          </TouchableOpacity>
        </View>
      </View>
      <BottomNavigation navigation={navigation} currentScreen="Map" items={DASHBOARD_NAV_ITEMS} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
  helpText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  markerImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  zoomControls: {
    position: 'absolute',
    right: 16,
    bottom: 100,
    backgroundColor: 'transparent',
  },
  zoomButton: {
    backgroundColor: 'white',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  zoomButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default MapScreen;
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenNavigationProp } from '@/types/navigation';
import { BottomNavigation } from '@/components/common/dashboard';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { useAuth } from '@/context/AuthContext';

import MissionManagementModal from '@/screens/dashboard/Mission/missionReportsUtils/MissionManagementModal';
import PinDetailsModal from '@/screens/dashboard/Map/mapUtils/PinDetailsModal';

import {
  CustomPin as MapPin,
  PIN_TYPES as MAP_PIN_TYPES,
  getPinIcon,
  getPinColor,
  requestLocationPermission,
  getCurrentLocation,
  addPinToFirestore,
  fetchPins,
  updatePin,
  deletePin,
} from '@/screens/dashboard/Map/mapUtils/mapUtils';

const { height, width } = Dimensions.get('window');

// Define the pin types
const PIN_TYPES = [
  { id: 'standard', name: 'Standard', icon: 'location-pin', color: '#F09737' },
  { id: 'alert', name: 'Alert', icon: 'warning', color: '#ff6b6b' },
  { id: 'info', name: 'Info', icon: 'info', color: '#4BB543' },
  { id: 'meeting', name: 'Meeting', icon: 'people', color: '#3498db' },
  { id: 'danger', name: 'Danger', icon: 'dangerous', color: '#e74c3c' },
];

interface CustomPin {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title: string;
  description: string;
  type: string;
  createdBy: string;
  timestamp: number;
}

interface MapControlsPosition {
  zoomControls: 'left' | 'right';
  pinToolbar: 'bottom' | 'top';
}

const MapScreen: React.FC = () => {
  const navigation = useNavigation<RootStackScreenNavigationProp<'Map'>>();
  const { userData } = useAuth();
  const mapRef = useRef<MapView | null>(null);

  // State for map and location
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(true);

  // State for pins
  const [pins, setPins] = useState<MapPin[]>([]);
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [pinCreationMode, setPinCreationMode] = useState<boolean>(false);
  const [selectedPinType, setSelectedPinType] = useState<string>('standard');

  // State for UI components
  const [settingsModalVisible, setSettingsModalVisible] = useState<boolean>(false);
  const [pinDetailsModalVisible, setPinDetailsModalVisible] = useState<boolean>(false);
  const [notificationsVisible, setNotificationsVisible] = useState<boolean>(false);
  const [showPinToolbar, setShowPinToolbar] = useState<boolean>(false);
  const [missionModalVisible, setMissionModalVisible] = useState<boolean>(false);

  // Mission state
  const [activeMissionId, setActiveMissionId] = useState<string | null>(null);
  const [missionMode, setMissionMode] = useState<boolean>(false);

  // User preferences
  const [mapControlsPosition, setMapControlsPosition] = useState<MapControlsPosition>({
    zoomControls: 'right',
    pinToolbar: 'bottom',
  });

  // Request location permissions and get initial location
  useEffect(() => {
    const requestLocationPermission = async () => {
      setLoadingLocation(true);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        setLocationPermission(true);

        try {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest,
          });

          setCurrentLocation(location);
          setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });

          // Animate map to current location
          mapRef.current?.animateToRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        } catch (error) {
          console.error('Error getting location:', error);
          Alert.alert(
            'Location Error',
            'Could not get your current location. Please check your device settings.',
            [{ text: 'OK' }]
          );
        }
      } else {
        setLocationPermission(false);
        Alert.alert(
          'Location Permission Required',
          'This app needs access to your location to show it on the map. Please enable location permissions in your device settings.',
          [{ text: 'OK' }]
        );
      }

      setLoadingLocation(false);
    };

    requestLocationPermission();

    // Subscribe to location updates
    let locationSubscription: Location.LocationSubscription | null = null;

    if (locationPermission) {
      // Store promise in a temporary variable
      const subscriptionPromise = Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        location => {
          setCurrentLocation(location);
        }
      );

      // Handle the promise
      subscriptionPromise
        .then(subscription => {
          locationSubscription = subscription;
        })
        .catch(error => {
          console.error('Error setting up location subscription:', error);
        });
    }

    // Return a cleanup function
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [locationPermission]);

  useEffect(() => {
    const loadPins = async () => {
      try {
        // Use the imported fetchPins function
        const loadedPins = await fetchPins();
        setPins(loadedPins);
      } catch (error) {
        console.error('Error loading pins:', error);
        // Fallback to mock data if needed
        const mockPins: MapPin[] = [
          {
            id: '1',
            coordinate: {
              latitude: 37.78825,
              longitude: -122.4324,
            },
            title: 'Team Meetup',
            description: 'Meet here at 2 PM',
            type: 'meeting',
            createdBy: 'Admin',
            timestamp: Date.now(),
          },
          {
            id: '2',
            coordinate: {
              latitude: 37.79,
              longitude: -122.43,
            },
            title: 'Hazard Area',
            description: 'Avoid this zone',
            type: 'danger',
            createdBy: 'Admin',
            timestamp: Date.now(),
          },
        ];
        setPins(mockPins);
      }
    };

    loadPins();
  }, []);

  const handleBackNavigation = () => {
    navigation.goBack();
  };

  const handleNotificationPress = () => {
    setNotificationsVisible(true);
  };

  const handleSettingsPress = () => {
    setSettingsModalVisible(true);
  };

  const handleMapPress = (event: any) => {
    if (pinCreationMode) {
      const newPin: MapPin = {
        id: Date.now().toString(),
        coordinate: event.nativeEvent.coordinate,
        title: `New ${selectedPinType} Pin`,
        description: 'Tap to edit details',
        type: selectedPinType,
        createdBy: userData?.displayName || 'User',
        timestamp: Date.now(),
      };

      addPinToFirestore(newPin)
        .then(pinId => {
          const pinWithId = { ...newPin, id: pinId };
          setPins([...pins, pinWithId]);
        })
        .catch(error => {
          console.error('Error adding pin:', error);
        });

      setPinCreationMode(false);
    }
  };

  const handleMarkerPress = (pin: CustomPin) => {
    setSelectedPin(pin);
    setPinDetailsModalVisible(true);
  };

  const handleZoomIn = () => {
    if (mapRef.current) {
      const newRegion = {
        ...region,
        latitudeDelta: region.latitudeDelta / 2,
        longitudeDelta: region.longitudeDelta / 2,
      };

      mapRef.current.animateToRegion(newRegion, 300);
      setRegion(newRegion);
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      const newRegion = {
        ...region,
        latitudeDelta: region.latitudeDelta * 2,
        longitudeDelta: region.longitudeDelta * 2,
      };

      mapRef.current.animateToRegion(newRegion, 300);
      setRegion(newRegion);
    }
  };

  const handleCenterOnUser = () => {
    if (mapRef.current && currentLocation) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } else if (!locationPermission) {
      Alert.alert(
        'Location Permission Required',
        'This feature requires location permission. Please enable it in your device settings.',
        [{ text: 'OK' }]
      );
    }
  };

  const togglePinToolbar = () => {
    setShowPinToolbar(!showPinToolbar);
  };

  const startPinCreation = (pinType: string) => {
    setSelectedPinType(pinType);
    setPinCreationMode(true);
    setShowPinToolbar(false);

    Alert.alert('Create New Pin', 'Tap on the map to place a pin.', [
      {
        text: 'Cancel',
        onPress: () => setPinCreationMode(false),
        style: 'cancel',
      },
      { text: 'OK' },
    ]);
  };

  const deletePin = (pinId: string) => {
    setPins(pins.filter(pin => pin.id !== pinId));
    setPinDetailsModalVisible(false);
  };

  const getPinIcon = (type: string) => {
    const pin = PIN_TYPES.find(pin => pin.id === type);
    return pin ? pin.icon : 'location-pin';
  };

  const getPinColor = (type: string) => {
    const pin = PIN_TYPES.find(pin => pin.id === type);
    return pin ? pin.color : '#F09737';
  };

  // Render map controls (zoom buttons)
  const renderMapControls = () => {
    return (
      <View
        style={[
          styles.mapControls,
          mapControlsPosition.zoomControls === 'left'
            ? styles.mapControlsLeft
            : styles.mapControlsRight,
        ]}
      >
        <TouchableOpacity style={styles.mapControlButton} onPress={handleZoomIn}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.mapControlButton} onPress={handleZoomOut}>
          <Ionicons name="remove" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.mapControlButton} onPress={handleCenterOnUser}>
          <Ionicons name="locate" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  // Render pin toolbar
  const renderPinToolbar = () => {
    if (!showPinToolbar) return null;

    return (
      <View
        style={[
          styles.pinToolbar,
          mapControlsPosition.pinToolbar === 'top' ? styles.pinToolbarTop : styles.pinToolbarBottom,
        ]}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {PIN_TYPES.map(pin => (
            <TouchableOpacity
              key={pin.id}
              style={styles.pinTypeButton}
              onPress={() => startPinCreation(pin.id)}
            >
              <MaterialIcons name={pin.icon as any} size={20} color={pin.color} />
              <Text style={styles.pinTypeText}>{pin.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  // Mission management handlers
  const handleMissionCreated = (missionId: string) => {
    setActiveMissionId(missionId);
    setMissionMode(true);

    // Could update map region, fetch mission-specific pins, etc.
    Alert.alert(
      'Mission Started',
      'You have successfully started a new mission. You can now add pins that will be shared with your team.',
      [{ text: 'OK' }]
    );
  };

  const handleMissionJoined = (missionId: string) => {
    setActiveMissionId(missionId);
    setMissionMode(true);

    // Could update map region, fetch mission-specific pins, etc.
    Alert.alert(
      'Mission Joined',
      'You have successfully joined a mission. You can now see and add pins shared with your team.',
      [{ text: 'OK' }]
    );
  };

  const handleEndMission = () => {
    Alert.alert('End Mission', 'Are you sure you want to end the current mission?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'End Mission',
        onPress: () => {
          setMissionMode(false);
          setActiveMissionId(null);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={locationPermission}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
        onPress={handleMapPress}
      >
        {/* Render custom pins */}
        {pins.map(pin => (
          <Marker
            key={pin.id}
            coordinate={pin.coordinate}
            title={pin.title}
            description={pin.description}
            pinColor={getPinColor(pin.type)}
            onPress={() => handleMarkerPress(pin)}
          >
            {/* You can implement custom marker views here */}
          </Marker>
        ))}
      </MapView>

      {/* Transparent Header */}
      <SafeAreaView style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackNavigation}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{missionMode ? 'Mission Map' : 'Map'}</Text>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setMissionModalVisible(true)}
            >
              <MaterialIcons name="assignment" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} onPress={handleSettingsPress}>
              <Ionicons name="settings-outline" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} onPress={handleNotificationPress}>
              <Ionicons name="notifications-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Mission Mode Indicator */}
      {missionMode && (
        <View style={styles.missionBanner}>
          <View style={styles.missionBannerContent}>
            <MaterialIcons name="assignment" size={18} color="#fff" />
            <Text style={styles.missionBannerText}>Mission Active</Text>
          </View>
          <TouchableOpacity onPress={handleEndMission}>
            <Text style={styles.endMissionText}>End</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Add Pin Button */}
      <TouchableOpacity style={styles.addPinButton} onPress={togglePinToolbar}>
        <Ionicons name={showPinToolbar ? 'close' : 'add'} size={24} color="#fff" />
      </TouchableOpacity>

      {/* Map Controls */}
      {renderMapControls()}

      {/* Pin Type Toolbar */}
      {renderPinToolbar()}

      {/* Settings Modal */}
      <Modal
        visible={settingsModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSettingsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Map Settings</Text>
              <TouchableOpacity onPress={() => setSettingsModalVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <Text style={styles.settingLabel}>Zoom Controls Position</Text>
              <View style={styles.settingOptions}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    mapControlsPosition.zoomControls === 'left' && styles.selectedOption,
                  ]}
                  onPress={() =>
                    setMapControlsPosition({ ...mapControlsPosition, zoomControls: 'left' })
                  }
                >
                  <Text style={styles.optionText}>Left</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    mapControlsPosition.zoomControls === 'right' && styles.selectedOption,
                  ]}
                  onPress={() =>
                    setMapControlsPosition({ ...mapControlsPosition, zoomControls: 'right' })
                  }
                >
                  <Text style={styles.optionText}>Right</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.settingLabel}>Pin Toolbar Position</Text>
              <View style={styles.settingOptions}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    mapControlsPosition.pinToolbar === 'top' && styles.selectedOption,
                  ]}
                  onPress={() =>
                    setMapControlsPosition({ ...mapControlsPosition, pinToolbar: 'top' })
                  }
                >
                  <Text style={styles.optionText}>Top</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    mapControlsPosition.pinToolbar === 'bottom' && styles.selectedOption,
                  ]}
                  onPress={() =>
                    setMapControlsPosition({ ...mapControlsPosition, pinToolbar: 'bottom' })
                  }
                >
                  <Text style={styles.optionText}>Bottom</Text>
                </TouchableOpacity>
              </View>

              {!locationPermission && (
                <TouchableOpacity
                  style={styles.locationPermissionButton}
                  onPress={async () => {
                    const { status } = await Location.requestForegroundPermissionsAsync();
                    setLocationPermission(status === 'granted');
                  }}
                >
                  <Text style={styles.locationPermissionText}>Enable Location Permission</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Pin Details Modal */}
      <Modal
        visible={pinDetailsModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPinDetailsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pin Details</Text>
              <TouchableOpacity onPress={() => setPinDetailsModalVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {selectedPin && (
              <ScrollView style={styles.modalScroll}>
                <View style={styles.pinDetails}>
                  <View style={styles.pinTypeIndicator}>
                    <MaterialIcons
                      name={getPinIcon(selectedPin.type) as any}
                      size={30}
                      color={getPinColor(selectedPin.type)}
                    />
                    <Text style={styles.pinTypeLabel}>
                      {PIN_TYPES.find(p => p.id === selectedPin.type)?.name || 'Standard'}
                    </Text>
                  </View>

                  <Text style={styles.pinDetailLabel}>Created By</Text>
                  <Text style={styles.pinDetailText}>{selectedPin.createdBy}</Text>

                  <Text style={styles.pinDetailLabel}>Date Created</Text>
                  <Text style={styles.pinDetailText}>
                    {new Date(selectedPin.timestamp).toLocaleString()}
                  </Text>

                  <Text style={styles.pinDetailLabel}>Coordinates</Text>
                  <Text style={styles.pinDetailText}>
                    {selectedPin.coordinate.latitude.toFixed(6)},
                    {selectedPin.coordinate.longitude.toFixed(6)}
                  </Text>

                  <TouchableOpacity
                    style={styles.deletePinButton}
                    onPress={() => deletePin(selectedPin.id)}
                  >
                    <Text style={styles.deletePinText}>Delete Pin</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Notifications Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={notificationsVisible}
        onRequestClose={() => setNotificationsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notifications</Text>
              <TouchableOpacity onPress={() => setNotificationsVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.emptyState}>
              <Ionicons name="notifications-off-outline" size={40} color="#666" />
              <Text style={styles.emptyStateText}>No notifications</Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Mission Management Modal */}
      <MissionManagementModal
        visible={missionModalVisible}
        onClose={() => setMissionModalVisible(false)}
        onMissionCreated={handleMissionCreated}
        onMissionJoined={handleMissionJoined}
      />

      {/* Pin Details Modal */}
      <PinDetailsModal
        visible={pinDetailsModalVisible}
        pin={selectedPin}
        onClose={() => setPinDetailsModalVisible(false)}
        onUpdate={updatedPin => {
          setPins(pins.map(p => (p.id === updatedPin.id ? updatedPin : p)));
        }}
        onDelete={pinId => {
          setPins(pins.filter(p => p.id !== pinId));
        }}
      />

      <BottomNavigation currentScreen="Map" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 60,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerRight: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  addPinButton: {
    position: 'absolute',
    bottom: 140,
    right: 20,
    backgroundColor: '#F09737',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 10,
  },
  mapControls: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    padding: 8,
    zIndex: 10,
  },
  mapControlsRight: {
    right: 16,
    top: 100,
  },
  mapControlsLeft: {
    left: 16,
    top: 100,
  },
  mapControlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  pinToolbar: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    padding: 8,
    zIndex: 10,
    left: 16,
    right: 16,
  },
  pinToolbarBottom: {
    bottom: 140,
  },
  pinToolbarTop: {
    top: 100,
  },
  pinTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
  },
  pinTypeText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '70%',
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalScroll: {
    maxHeight: '80%',
  },
  settingLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
    marginTop: 16,
  },
  settingOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  optionButton: {
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    flex: 1,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#F09737',
  },
  optionText: {
    color: '#fff',
  },
  locationPermissionButton: {
    backgroundColor: '#F09737',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  locationPermissionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pinDetails: {
    padding: 8,
  },
  pinTypeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  pinTypeLabel: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 8,
  },
  pinDetailLabel: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 8,
  },
  pinDetailText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  deletePinButton: {
    backgroundColor: '#8B0000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  deletePinText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    color: '#666',
    marginTop: 12,
    fontSize: 16,
  },
  missionBanner: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 110,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(240, 151, 55, 0.8)',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    zIndex: 15,
  },
  missionBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  missionBannerText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  endMissionText: {
    color: '#fff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  missionButton: {
    position: 'absolute',
    bottom: 200,
    right: 20,
    backgroundColor: '#4BB543',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 10,
  },
});

export default MapScreen;

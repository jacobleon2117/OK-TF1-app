import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Text, StatusBar, Alert, Platform, Linking } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation';
import { ScreenHeader, BottomNavigation } from '@/components/common/dashboard';
import { DASHBOARD_NAV_ITEMS } from '@/constants/navigation';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const MapScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    getLocation();
  }, []);

  const handleBackNavigation = () => {
    navigation.goBack();
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
      <ScreenHeader title="Map" onBack={handleBackNavigation} />
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: location?.coords.latitude || 37.7749,
            longitude: location?.coords.longitude || -122.4194,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          region={location ? {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          } : undefined}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          showsScale={true}
          showsTraffic={true}
          showsBuildings={true}
          showsIndoors={true}
          showsPointsOfInterest={true}
        >
          {location && (
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="You are here"
              description="Your current location"
            />
          )}
        </MapView>
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
});

export default MapScreen; 
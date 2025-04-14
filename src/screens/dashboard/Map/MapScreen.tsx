import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesome } from '@expo/vector-icons';
import Mapbox from '@rnmapbox/maps';
import { BottomNavigation, ScreenHeader } from '@/components/common/dashboard';
import { DASHBOARD_NAV_ITEMS } from '@/constants/navigation';
import { RootStackParamList } from '@/types/navigation';
import * as Location from 'expo-location';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const MapScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setIsLoading(false);
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        setErrorMsg('Could not get current location');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleBackNavigation = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScreenHeader title="Team Map" onBack={handleBackNavigation} />

      <View style={styles.mapContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading map...</Text>
          </View>
        ) : errorMsg ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMsg}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => navigation.replace('Map')}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Mapbox.MapView style={styles.map}>
            {location && (
              <Mapbox.PointAnnotation
                id="userLocation"
                coordinate={[location.coords.longitude, location.coords.latitude]}
                title="Your Location"
              >
                <View style={styles.annotationContainer}>
                  <View style={styles.annotationFill} />
                </View>
              </Mapbox.PointAnnotation>
            )}
          </Mapbox.MapView>
        )}
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
    overflow: 'hidden',
    borderRadius: 12,
    margin: 16,
    marginBottom: 80,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
    padding: 20,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#F09737',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  annotationContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  annotationFill: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#F09737',
    borderWidth: 2,
    borderColor: 'white',
  },
});

export default MapScreen;

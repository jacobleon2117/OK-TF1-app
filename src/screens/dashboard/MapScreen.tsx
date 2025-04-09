import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, Platform, StatusBar as RNStatusBar, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import TabBar from '../../components/navigation/TabBar';
import Header from '../../components/layout/Header';
// import MapboxGL from '@rnmapbox/maps';

// Set your MapBox access token
// MapboxGL.setAccessToken('YOUR_MAPBOX_ACCESS_TOKEN');

const MapScreen = ({ navigation }) => {
  const [currentScreen, setCurrentScreen] = useState('Map');
//   const [mapReady, setMapReady] = useState(false);
  
  // Default coordinates - update to your preferred initial location
//   const initialCoordinates = [-122.4324, 37.7795]; // San Francisco
//   const initialZoomLevel = 12;

//   useEffect(() => {
//     // Check if location permissions are enabled (Android only)
//     const checkLocationPermission = async () => {
//       if (Platform.OS === 'android') {
//         const isGranted = await MapboxGL.requestAndroidLocationPermissions();
//         console.log('Location permissions granted:', isGranted);
//       }
//     };

//     checkLocationPermission();
//   }, []);

  // Handle screen changes
  const handleScreenChange = (screenName) => {
    setCurrentScreen(screenName);
    if (navigation && screenName !== 'Map') {
      navigation.navigate(screenName);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.background}>
        {/* Full screen purple background (will be replaced with MapboxGL.MapView) */}
        <View style={styles.mapExtent}>
          {/* When ready to implement the real map, replace this View with:
          <MapboxGL.MapView
            style={styles.map}
            styleURL={MapboxGL.StyleURL.Dark}
            onDidFinishLoadingMap={() => setMapReady(true)}
          >
            <MapboxGL.Camera
              zoomLevel={initialZoomLevel}
              centerCoordinate={initialCoordinates}
              animationDuration={0}
            />
            
            <MapboxGL.PointAnnotation
              id="currentLocation"
              coordinate={initialCoordinates}
            />
          </MapboxGL.MapView>
          */}
          
          {/* Header container positioned at top */}
          <View style={styles.headerContainer}>
            <Header />
          </View>
          
          {/* Footer container positioned at bottom */}
          <View style={styles.footerContainer}>
            <View style={styles.tabBarWrapper}>
              <TabBar 
                currentScreen={currentScreen}
                onScreenChange={handleScreenChange}
                style={styles.tabBar}
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  background: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight || 0 : 0,
  },
  mapExtent: {
    flex: 1,
    backgroundColor: 'purple', // Purple for demonstration, will be replaced by actual map
    borderRadius: 8,
    position: 'relative', // Needed for absolute positioning of children
  },
  map: {
    flex: 1,
  },
  headerContainer: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    opacity: 0.3, // Dark, semi-transparent background
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight || 0 : 0,
  },
  footerContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 80, // Positioned higher up from the bottom
    zIndex: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  tabBarWrapper: {
    width: '100%',
    borderRadius: 30, // Rounded ends
    overflow: 'hidden',
    backgroundColor: 'rgba(34, 34, 34, 0.8)', // Slightly transparent dark background
    // Shadow for elevation effect
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabBar: {
    width: '100%',
  }
});

export default MapScreen;

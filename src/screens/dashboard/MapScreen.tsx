import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, StatusBar as RNStatusBar, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import TabBarMap from '../../components/navigation/TabBarMap';
import Header from '../../components/layout/Header';
import Mapbox from '@rnmapbox/maps';

// Set the token
Mapbox.setAccessToken('pk.eyJ1IjoiYWRlbGtub2RlIiwiYSI6ImNtOWpkaWc3MzBiZWYybHB0YjY0ejEwdjUifQ.6TDz0lDslKBf6lDCpRvOkQ');

const MapScreen = ({ navigation }) => {
  const [currentScreen, setCurrentScreen] = useState('Map');
  const [mapReady, setMapReady] = useState(false);

  // Add CSS for web platform
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Check if the CSS is already loaded to avoid duplicates
      const existingLink = document.head.querySelector('link[href*="mapbox-gl.css"]');

      if (!existingLink) {
        console.log("Adding Mapbox CSS to head");
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css';
        document.head.appendChild(link);
      }
    }
  }, []);

  // Handle screen changes
  const handleScreenChange = (screenName) => {
    setCurrentScreen(screenName);
    if (navigation && screenName !== 'Map') {
      navigation.navigate(screenName);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="transparent" />

      {/* Map View */}
      <View style={styles.mapExtent}>
        {/* Fallback in case map doesn't load */}
        <View style={styles.mapPlaceholder}>
          <Text style={styles.placeholderText}>
            {mapReady ? '' : 'Map Loading...'}
          </Text>
        </View>

        {/* Just the MapView without children */}
        <Mapbox.MapView
          style={styles.map}
          styleURL={Mapbox.StyleURL.Dark}
          onDidFinishLoadingMap={() => {
            console.log("Map finished loading!");
            setMapReady(true);
          }}
          onDidFailLoadingMap={(error) => {
            console.error("Map failed to load:", error);
          }}
        />
      </View>

      {/* Header container positioned at top */}
      <View style={styles.headerContainer}>
        <Header />
      </View>

      {/* Footer container positioned at bottom */}
      <View style={styles.footerContainer}>
        <View style={styles.tabBarWrapper}>
          <TabBarMap
            currentScreen={currentScreen}
            onScreenChange={handleScreenChange}
            style={styles.tabBar}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  mapExtent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mapPlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  placeholderText: {
    color: '#fff',
    fontSize: 18,
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
    backgroundColor: '#111',
    opacity: 0.3,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight || 0 : 60,
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

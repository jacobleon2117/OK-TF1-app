import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import TabBarMain from '../../components/navigation/TabBarMain';

const ProfileScreen = ({ navigation }) => {
  const [currentScreen, setCurrentScreen] = useState('Profile');

  // Handle screen changes
  const handleScreenChange = (screenName) => {
    setCurrentScreen(screenName);
    if (navigation && screenName !== 'Profile') {
      navigation.navigate(screenName);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.background}>
        <View style={styles.headerContainer}>
          {/* Your header component can go here */}
        </View>
        
        <View style={styles.content}>
          {/* Main content of the Schedule screen */}
        </View>
        
        <View style={styles.footerContainer}>
          <TabBarMain 
            currentScreen={currentScreen}
            onScreenChange={handleScreenChange}
          />
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
  headerContainer: {
    width: '100%',
    position: 'absolute',
    top: Platform.OS === 'android' ? RNStatusBar.currentHeight || 0 : 0,
    zIndex: 10,
  },
  content: {
    flex: 1,
    paddingTop: 60, // Provide space for header
    paddingBottom: 60, // Provide space for tab bar
    paddingHorizontal: 8,
  },
  footerContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    zIndex: 10,
  },
});

export default ProfileScreen;

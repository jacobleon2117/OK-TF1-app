import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ImageBackground, SafeAreaView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TabBar from '../components/TabBar';
import Header from '../components/Header';

const HomeScreen = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Try to get username from AsyncStorage
    const getUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
        }
      } catch (error) {
        console.error('Failed to load username', error);
      }
    };

    getUsername();
  }, []);

  // Handler functions for touchable components
  const handleProfilePress = () => {
    Alert.alert('Profile', 'You pressed the profile tab');
    // Handle profile navigation or action
  };

  const handleNotificationsPress = () => {
    Alert.alert('Notifications', 'You pressed the notifications tab');
    // Handle notifications
  };

  const handleMenuPress = () => {
    Alert.alert('Menu', 'You pressed the menu tab');
    // Handle menu open
  };

  const handleHomePress = () => {
    Alert.alert('Home', 'You pressed the Home tab');
    // Already on home, no action needed
  };

  const handleSchedulePress = () => {
    Alert.alert('Schedule', 'You pressed the Schedule tab');
    // Navigate to schedule screen
  };

  const handleMapPress = () => {
    Alert.alert('Map', 'You pressed the Map tab');
    // Navigate to map screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground 
        source={require('../../assets/firefighters5.jpg')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <Header 
          username={username} 
          onProfilePress={handleProfilePress}
          onNotificationsPress={handleNotificationsPress}
          onMenuPress={handleMenuPress}
        />
        <View style={styles.content}>
          {/* Home screen content goes here */}
        </View>
        <TabBar 
          onHomePress={handleHomePress}
          onSchedulePress={handleSchedulePress}
          onMapPress={handleMapPress}
        />
        <StatusBar style="auto" />
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    marginTop: 60, // Increase margin to account for the header tabs
    marginBottom: 60, // Add margin for tab bar
  },
});

export default HomeScreen;

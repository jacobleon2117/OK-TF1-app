import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, Alert, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TabBar from '../components/TabBar';
import Header from '../components/Header';
import { 
  WeatherWidget, 
  StatusWidget, 
  TemperatureWidget, 
  InfoWidget 
} from '../components/widgets';

const HomeScreen = () => {
  const [username, setUsername] = useState('');
  const [avatarUri, setAvatarUri] = useState(null);

  useEffect(() => {
    // Try to get username and avatar from AsyncStorage
    const getUserInfo = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        const storedAvatarUri = await AsyncStorage.getItem('avatarUri');
        
        if (storedUsername) {
          setUsername(storedUsername);
        }

        if (storedAvatarUri) {
          setAvatarUri(storedAvatarUri);
        }
      } catch (error) {
        console.error('Failed to load user information', error);
      }
    };

    getUserInfo();
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
    Alert.alert('Home', 'You are Here. Welcome home tab');
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
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.headerContainer}>
        <Header 
          username={username} 
          avatarUri={avatarUri}
          onProfilePress={handleProfilePress}
          onNotificationsPress={handleNotificationsPress}
          onMenuPress={handleMenuPress}
        />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <WeatherWidget />
        <StatusWidget />
        <TemperatureWidget />
        <InfoWidget />
      </ScrollView>
      
      <View style={styles.footerContainer}>
        <TabBar 
          onHomePress={handleHomePress}
          onSchedulePress={handleSchedulePress}
          onMapPress={handleMapPress}
        />
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: 45, // Add padding to avoid status bar overlap
  },
  content: {
    flex: 1,
    marginTop: 105, // Increased to account for header + status bar
    marginBottom: 80, // Increased to ensure content doesn't get hidden behind tab bar
  },
  scrollContent: {
    paddingVertical: 10,
    paddingBottom: 20, // Add extra padding at the bottom
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100, // Increased zIndex to ensure it appears above system notifications
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingBottom: 20, // Increased padding for devices with home indicator
    height: 70, // Set a specific height for the footer
    elevation: 7, // Android elevation
    shadowColor: "#000", // iOS shadow
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default HomeScreen;

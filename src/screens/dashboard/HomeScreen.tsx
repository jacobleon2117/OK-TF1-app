import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TabBar from '../../components/TabBar';
import Header from '../../components/Header';
import Toast from 'react-native-toast-message';
import { 
  LocationCard, 
  ScheduleCard,
  MessageCard,
  StatusCard,
} from '../../components/cards';

// navigation is to other screens 
const HomeScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  // Add state for current screen since it's used in handleMapPress
  const [currentScreen, setCurrentScreen] = useState('Home');

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
  // In the header
  const handleNotificationsPress = () => {
    Toast.show({
      type: 'info',
      text1: 'Notification',
      text2: 'You pressed the notification tab',
      visibilityTime: 1000,
      autoHide: true,
      position: 'bottom',
      bottomOffset: 300,
    });
    // navigation.navigate('Notifications');
  };
  
  // For cards
  const handleMessageCardPress = () => {
    Toast.show({
      type: 'info',
      text1: 'Message Card',
      text2: 'You pressed the message card',
      visibilityTime: 1000,
      autoHide: true,
      position: 'bottom',
      bottomOffset: 300,
    });
  };

  const handleScheduleCardPress = () => {
    Toast.show({
      type: 'info',
      text1: 'Schedule Card',
      text2: 'You pressed the schedule card',
      visibilityTime: 1000,
      autoHide: true,
      position: 'bottom',
      bottomOffset: 300,
    });
  };
  
  const handleLocationCardPress = () => {
    Toast.show({
      type: 'info',
      text1: 'Location Card',
      text2: 'You pressed the location card',
      visibilityTime: 1000,
      autoHide: true,
      position: 'bottom',
      bottomOffset: 300,
    });
  };
  
  const handleStatusCardPress = () => {
    Toast.show({
      type: 'info',
      text1: 'Status Card',
      text2: 'You pressed the status card',
      visibilityTime: 1000,
      autoHide: true,
      position: 'bottom',
      bottomOffset: 300,
    });
  };
  

  // In the footer
  const handleHomePress = () => {
    Toast.show({
      type: 'info',
      text1: 'Home',
      text2: 'You pressed the home tab',
      visibilityTime: 1000,
      autoHide: true,
      position: 'bottom',
      bottomOffset: 300,
    });
    // navigation.navigate('Home');
  };
  
  const handleSchedulePress = () => {
    Toast.show({
      type: 'success',
      text1: 'Schedule',
      text2: 'You pressed the Schedule tab',
      visibilityTime: 1000,
      autoHide: true,
      position: 'bottom',
      bottomOffset: 300,
    });
    // navigation.navigate('Schedule');
  };

  const handleMapPress = () => {
    Toast.show({
      type: 'info',
      text1: 'Map',
      text2: 'You pressed the Map tab',
      visibilityTime: 1000,
      autoHide: true,
      position: 'bottom',
      bottomOffset: 300,
    });
    setCurrentScreen('Map');
    // navigation.navigate('Map');
  };

  const handleMessagePress = () => {
    Toast.show({
      type: 'info',
      text1: 'Message',
      text2: 'You pressed the message button',
      visibilityTime: 1000,
      autoHide: true,
      position: 'bottom',
      bottomOffset: 300,
    });
  };

  const handleProfilePress = () => {
    Toast.show({
      type: 'info',
      text1: 'Profile',
      text2: 'You pressed the profile tab',
      visibilityTime: 1000,
      autoHide: true,
      position: 'bottom',
      bottomOffset: 300,
    });
    // navigation.navigate('Profile');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.background}>
        {/* Header fixed at top */}
        <View style={styles.headerContainer}>
          <Header 
            username={username} 
            onProfilePress={handleProfilePress}
            onNotificationsPress={handleNotificationsPress}
          />
        </View>
        
        {/* Content with scrolling */}
        <View style={styles.content}>
          <View style={styles.topCardItem}>
            <MessageCard onPress={handleMessageCardPress} />
          </View>
  
          <View style={styles.middleCardItem}>
            <ScheduleCard onPress={handleScheduleCardPress} />
          </View>
  
          <View style={styles.bottomRowContainer}>
            <View style={styles.bottomColumn}>
              <LocationCard onPress={handleLocationCardPress} />
            </View>
    
            <View style={styles.bottomColumn}>
              <StatusCard onPress={handleStatusCardPress} />
            </View>
        </View>
      </View>
        
        {/* Footer fixed at bottom */}
        <View style={styles.footerContainer}>
          <TabBar 
            onHomePress={handleHomePress}
            onSchedulePress={handleSchedulePress}
            onMapPress={handleMapPress}
            onProfilePress={handleProfilePress}
            onMessagePress={handleMessagePress}
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
  topCardItem: {
    width: '100%',
    flex: 1, // 1/5 of the available space
  },
  middleCardItem: {
    width: '100%',
    flex: 2, // 2/5 of the available space (twice the height of top/bottom)
  },
  bottomRowContainer: {
    width: '100%',
    flex: 1, // 1/5 of the available space
    flexDirection: 'row', // Arrange horizontally
  },
  bottomColumn: {
    flex: 1, // Each column takes 50% of the width
  },
  footerContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    zIndex: 10,
  },
});

export default HomeScreen;

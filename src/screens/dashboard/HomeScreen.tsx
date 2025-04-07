import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, Alert, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TabBar from '../../components/TabBar';
import Header from '../../components/Header';
import { 
  StatusWidget, 
  ScheduleCard,
  MessageCard,
  InfoWidget
} from '../../components/widgets';

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
  const handleProfilePress = () => {
    Alert.alert('Profile', 'You pressed the profile tab');
    // navigation.navigate('Profile');
  };

  const handleNotificationsPress = () => {
    Alert.alert('Notifications', 'You pressed the notifications tab');
    // navigation.navigate('Notifications');
  };

  const handleMenuPress = () => {
    Alert.alert('Menu', 'You pressed the menu tab');
    // navigation.navigate('Menu');
  };

  const handleHomePress = () => {
    Alert.alert('Home', 'You pressed the Home tab');
    // navigation.navigate('Home');
  };

  const handleSchedulePress = () => {
    Alert.alert('Schedule', 'You pressed the Schedule tab');
    // navigation.navigate('Schedule');
  };

  const handleMapPress = () => {
    setCurrentScreen('Map');
    // navigation.navigate('Map');
  };

  const handleMessageCardPress = () => {
    handleMapPress();
    // navigation.navigate('Map');
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
            onMenuPress={handleMenuPress}
          />
        </View>
        
        {/* Content with scrolling */}
        <View style={styles.content}>
          {/* Top row - 1/5 of the available space */}
          <View style={styles.topCardItem}>
            <MessageCard onPress={handleMessageCardPress} />
          </View>
          
          {/* Middle row - 2/5 of the available space (twice the height of top/bottom) */}
          <View style={styles.middleCardItem}>
            <ScheduleCard />
          </View>
          
          {/* Bottom row - 1/5 of the available space, split into two equal columns */}
          <View style={styles.bottomRowContainer}>
            <View style={styles.bottomColumn}>
              <StatusWidget />
            </View>
            
            <View style={styles.bottomColumn}>
              <InfoWidget />
            </View>
          </View>
        </View>
        
        {/* Footer fixed at bottom */}
        <View style={styles.footerContainer}>
          <TabBar 
            onHomePress={handleHomePress}
            onSchedulePress={handleSchedulePress}
            onMapPress={handleMapPress}
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
    flexDirection: 'row', // Arrange children horizontally
  },
  bottomColumn: {
    flex: 1, // Each column takes 50% of the parent width
  },
  footerContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    zIndex: 10,
  },
});

export default HomeScreen;
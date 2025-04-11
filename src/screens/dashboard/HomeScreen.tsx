// src/dashboard/HomeScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import TabBarMain from '../../components/navigation/TabBarMain';
import Header from '../../components/layout/Header';
import { 
  LocationCard, 
  ScheduleCard,
  MessageCard,
  StatusCard,
} from '../../components/cards';

const HomeScreen = ({ navigation }) => {
  const [currentScreen, setCurrentScreen] = useState('Home');

  // Handle screen changes
  const handleScreenChange = (screenName) => {
    setCurrentScreen(screenName);
    if (navigation && screenName !== 'Home') {
      navigation.navigate(screenName);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.background}>
        {/* Header fixed at top */}
        <View style={styles.headerContainer}>
          <Header />
        </View>
        
        {/* Content with scrolling */}
        <View style={styles.content}>
          <View style={styles.topCardItem}>
            <MessageCard />
          </View>
  
          <View style={styles.middleCardItem}>
            <ScheduleCard />
          </View>
  
          <View style={styles.bottomRowContainer}>
            <View style={styles.bottomColumn}>
              <LocationCard />
            </View>
    
            <View style={styles.bottomColumn}>
              <StatusCard />
            </View>
          </View>
        </View>
        
        {/* Footer fixed at bottom */}
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

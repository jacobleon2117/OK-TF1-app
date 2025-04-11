// src/components/navigation/TabBarMap.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import HomeIcon from './icons/HomeIcon';
import ScheduleIcon from './icons/ScheduleIcon';
import MessageIcon from './icons/MessageIcon';
import MapIcon from './icons/MapIcon';
import ProfileIcon from './icons/ProfileIcon';
import NavigationService from '../../services/NavigationService';

// Default no-op function to prevent undefined errors
const noop = () => {};

const TabBarMap = ({ 
  currentScreen,
  onScreenChange = noop,
  style = {},
  iconProps = {} 
}) => {
  // Initialize activeTab state from currentScreen prop or default to 'home'
  const [activeTab, setActiveTab] = useState(currentScreen?.toLowerCase() || 'map');
  
  // Update activeTab when currentScreen prop changes
  useEffect(() => {
    if (currentScreen) {
      setActiveTab(currentScreen.toLowerCase());
    }
  }, [currentScreen]);

  // Tab press handlers that update state and call NavigationService
  const handleHomePress = () => {
    setActiveTab('home');
    NavigationService.handleHomePress();
    onScreenChange('Home');
  };

  const handleSchedulePress = () => {
    setActiveTab('schedule');
    NavigationService.handleSchedulePress();
    onScreenChange('Schedule');
  };

  const handleMessagePress = () => {
    setActiveTab('messages');
    NavigationService.handleMessagePress();
  };
  
  const handleMapPress = () => {
    setActiveTab('map');
    NavigationService.handleMapPress();
    onScreenChange('Map');
  };
  
  const handleProfilePress = () => {
    setActiveTab('profile');
    NavigationService.handleProfilePress();
    onScreenChange('Profile');
  };

  // Tab configuration array
  const tabs = [
    {
      name: 'home',
      icon: HomeIcon,
      label: 'Home',
      onPress: handleHomePress
    },
    {
      name: 'schedule',
      icon: ScheduleIcon,
      label: 'Schedule',
      onPress: handleSchedulePress
    },
    {
      name: 'messages',
      icon: MessageIcon,
      label: 'Messages',
      onPress: handleMessagePress
    },
    {
      name: 'map',
      icon: MapIcon,
      label: 'Map',
      onPress: handleMapPress
    },
    {
      name: 'profile',
      icon: ProfileIcon,
      label: 'Profile',
      onPress: handleProfilePress
    }
  ];

  return (
    <View style={[styles.tabBar, style]}>
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        return (
          <TouchableOpacity 
            key={tab.name}
            style={[
              styles.tab, 
              activeTab === tab.name && styles.activeTab
            ]} 
            onPress={tab.onPress}
          >
            <IconComponent 
              active={activeTab === tab.name}
              showLabel={true}
              label={tab.label}
              {...iconProps}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#111',
    width: '100%',
    height: 60,
    paddingHorizontal: 10,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 10,
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#F7941D',
  },
});

export default TabBarMap;

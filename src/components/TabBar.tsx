// src/components/TabBar.tsx
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import HomeIcon from './icons/HomeIcon';
import ScheduleIcon from './icons/ScheduleIcon';
import MessageIcon from './icons/MessageIcon';
import MapIcon from './icons/MapIcon';
import ProfileIcon from './icons/ProfileIcon';

// Default no-op function to prevent undefined errors
const noop = () => {};

const TabBar = ({ 
  onHomePress = noop, 
  onSchedulePress = noop, 
  onMessagePress = noop, 
  onMapPress = noop, 
  onProfilePress = noop,
  style = {},
  iconProps = {} 
}) => {
  const [activeTab, setActiveTab] = useState('home');

  const handleHomePress = () => {
    setActiveTab('home');
    onHomePress();
  };

  const handleSchedulePress = () => {
    setActiveTab('schedule');
    onSchedulePress();
  };

  const handleMessagePress = () => {
    setActiveTab('messages');
    onMessagePress();
  };
  
  const handleMapPress = () => {
    setActiveTab('map');
    onMapPress();
  };
  
  const handleProfilePress = () => {
    setActiveTab('profile');
    onProfilePress();
  };

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
      name: 'Message',
      icon: MessageIcon,
      label: 'Message',
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

export default TabBar;

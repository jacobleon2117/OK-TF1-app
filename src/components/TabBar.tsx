// src/components/TabBar.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProfileIcon from './icons/ProfileIcon';
import iconStyle from './icons/IconStyle';

// Default no-op function to prevent undefined errors
const noop = () => {};

const TabBar = ({ 
  onHomePress = noop, 
  onSchedulePress = noop, 
  onMapPress = noop, 
  onProfilePress = noop,
  style = {},
  iconProps = {}
 }) => {
  const [activeTab, setActiveTab] = useState('home');

  // Helper function to determine if a tab is active
  const isActive = (tabName) => activeTab === tabName;

  const handleHomePress = () => {
    setActiveTab('home');
    onHomePress();
  };

  const handleSchedulePress = () => {
    setActiveTab('schedule');
    onSchedulePress();
  };

  const handleMapPress = () => {
    setActiveTab('map');
    onMapPress();
  };

  const handleProfilePress = () => {
    setActiveTab('profile');
    onProfilePress();
  };

  return (
    <View style={[styles.tabBar, style]}>
      <TouchableOpacity 
        style={[styles.tab, isActive('home') && styles.activeTab]} 
        onPress={handleHomePress}
      >
        <Ionicons 
          name={isActive('home') ? 'home' : 'home-outline'} 
          size={iconStyle.sizes.default} 
          color={isActive('home') ? iconStyle.active : iconStyle.inactive} 
        />
        <Text 
          style={[styles.tabText, isActive('home') && styles.activeTabText]}
        >
          Home
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.tab, isActive('schedule') && styles.activeTab]} 
        onPress={handleSchedulePress}
      >
        <Ionicons 
          name={isActive('schedule') ? 'calendar' : 'calendar-outline'} 
          size={iconStyle.sizes.default} 
          color={isActive('schedule') ? iconStyle.active : iconStyle.inactive} 
        />
        <Text 
          style={[styles.tabText, isActive('schedule') && styles.activeTabText]}
        >
          Schedule
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.tab, isActive('map') && styles.activeTab]} 
        onPress={handleMapPress}
      >
        <Ionicons 
          name={isActive('map') ? 'map' : 'map-outline'} 
          size={iconStyle.sizes.default} 
          color={isActive('map') ? iconStyle.active : iconStyle.inactive} 
        />
        <Text 
          style={[styles.tabText, isActive('map') && styles.activeTabText]}
        >
          Map
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.tab, isActive('profile') && styles.activeTab]} 
        onPress={handleProfilePress}
      >
        <ProfileIcon 
          active={isActive('profile')}
          showLabel={true}
          label="Profile"
          {...iconProps}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#111',
    width: '100%',
    height: '100%',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    flex: 1,
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: iconStyle.active, // Using theme orange color
  },
  tabText: {
    fontSize: iconStyle.fontSizes.label,
    marginTop: 2,
    color: iconStyle.inactive, // Using theme blue color
  },
  activeTabText: {
    color: iconStyle.active, // Using theme orange color
    fontWeight: 'bold',
  }
});

export default TabBar;


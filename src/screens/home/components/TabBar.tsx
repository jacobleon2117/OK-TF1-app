// src/components/TabBar.jsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TabBar = ({ onHomePress, onSchedulePress, onMapPress }) => {
  const [activeTab, setActiveTab] = useState('home');

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

  return (
    <View style={styles.tabBar}>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'home' && styles.activeTab]} 
        onPress={handleHomePress}
      >
        <Ionicons 
          name={activeTab === 'home' ? 'home' : 'home-outline'} 
          size={24} 
          color={activeTab === 'home' ? '#ff6b6b' : '#999'} 
        />
        <Text 
          style={[styles.tabText, activeTab === 'home' && styles.activeTabText]}
        >
          Home
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'schedule' && styles.activeTab]} 
        onPress={handleSchedulePress}
      >
        <Ionicons 
          name={activeTab === 'schedule' ? 'calendar' : 'calendar-outline'} 
          size={24} 
          color={activeTab === 'schedule' ? '#ff6b6b' : '#999'} 
        />
        <Text 
          style={[styles.tabText, activeTab === 'schedule' && styles.activeTabText]}
        >
          Schedule
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'map' && styles.activeTab]} 
        onPress={handleMapPress}
      >
        <Ionicons 
          name={activeTab === 'map' ? 'map' : 'map-outline'} 
          size={24} 
          color={activeTab === 'map' ? '#ff6b6b' : '#999'} 
        />
        <Text 
          style={[styles.tabText, activeTab === 'map' && styles.activeTabText]}
        >
          Map
        </Text>
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
    borderTopColor: '#ff6b6b',
  },
  tabText: {
    fontSize: 12,
    marginTop: 2,
    color: '#999',
  },
  activeTabText: {
    color: '#ff6b6b',
    fontWeight: 'bold',
  }
});

export default TabBar;

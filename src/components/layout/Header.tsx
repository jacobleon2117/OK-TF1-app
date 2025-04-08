// src/components/layout/Header.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavigationService from '../../services/NavigationService';

const Header = ({ style = {} }) => {
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
  
  const handleNotificationsPress = () => {
    NavigationService.handleNotificationsPress();
  };

  const handleProfilePress = () => {
    NavigationService.handleProfilePress();
  };
  
  return (
    <View style={[styles.header, style]}>
      <TouchableOpacity onPress={handleProfilePress} style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.username}>
          {username || 'Jacob'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={handleNotificationsPress} style={styles.iconButton}>
        <Ionicons name="notifications-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingLeft: 25,
    paddingRight: 35,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  welcomeContainer: {
    fontWeight: 'bold',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  welcomeText: {
    color: 'white',
    fontSize: 15,
  },
  username: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15
  },
  iconButton: {
    padding: 5,
  }
});

export default Header;

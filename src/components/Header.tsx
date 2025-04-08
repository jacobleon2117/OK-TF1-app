import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Default no-op function to prevent undefined errors
const noop = () => {};

const Header = ({
  onProfilePress = noop,
  onNotificationsPress = noop,
  style = {},
  iconProps = {}
}) => {
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
  
  return (
    <View style={[styles.header, style]}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.username}>
          {username || 'Jacob'}
        </Text>
      </View>
      
      <TouchableOpacity onPress={onNotificationsPress} style={styles.iconButton}>
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
    backgroundColor: '#000', // Changed to pure black
    paddingVertical: 10,
    paddingLeft: 25,
    paddingRight: 35, // Increased margin on the outside edges
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

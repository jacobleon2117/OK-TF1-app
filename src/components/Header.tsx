import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Header = () => {
  // Fake username
  const username = "Jacob";
  
  const onNotificationsPress = () => {
    // Future implementation: Navigate to notifications page
    console.log("Navigate to notifications");
  };
  
  return (
    <View style={styles.header}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.username}>
          {username}
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
    fontSize: 18,
  },
  username: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  iconButton: {
    padding: 5,
  }
});

export default Header;
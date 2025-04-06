import React from 'react';
import { StyleSheet, Text, View, StatusBar, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define navigation types that align with your app's structure
type RootStackParamList = {
  Dashboard: undefined;
  Messages: undefined;
  Calendar: undefined;
  Map: undefined;
  Profile: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const MessagesScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleBackNavigation = () => {
    // Use goBack or navigate based on your app's structure
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Top Navigation Bar */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackNavigation}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={styles.headerRight} />
      </View>
      
      {/* Message List Container */}
      <ScrollView style={styles.messageContainer}>
        {/* Message list will be populated from Firebase later */}
      </ScrollView>
      
      {/* Floating Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => navigation.navigate('Dashboard')}
          >
            <FontAwesome name="home" size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => navigation.navigate('Calendar')}
          >
            <FontAwesome name="calendar" size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navItem}
            // Already on Messages screen
          >
            <FontAwesome name="comments" size={24} color="#FF8C00" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => navigation.navigate('Map')}
          >
            <FontAwesome name="map" size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => navigation.navigate('Profile')}
          >
            <FontAwesome name="user" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 50, // Add extra margin for iOS status bar
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerRight: {
    width: 40,
  },
  messageContainer: {
    flex: 1,
    marginBottom: 80, // Space for the floating nav bar
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 20, // Space from bottom of screen
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  bottomNav: {
    height: 60,
    flexDirection: 'row',
    backgroundColor: '#111',
    borderRadius: 30, // Rounded corners
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MessagesScreen;
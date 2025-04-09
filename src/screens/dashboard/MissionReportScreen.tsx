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
  MissionReports: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const MissionReportsScreen = () => {
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
        <Text style={styles.headerTitle}>Mission Reports</Text>
        <View style={styles.headerRight} />
      </View>
      
      {/* Mission Reports List Container */}
      <ScrollView style={styles.reportsContainer}>
        <View style={styles.emptyStateContainer}>
          <FontAwesome name="file-text-o" size={48} color="#333" />
          <Text style={styles.emptyStateText}>No mission reports available</Text>
        </View>
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
            onPress={() => navigation.navigate('Messages')}
          >
            <FontAwesome name="comments" size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => navigation.navigate('Map')}
          >
            <FontAwesome name="map" size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navItem}
            // Already on Mission Reports screen
          >
            <FontAwesome name="file-text-o" size={22} color="#FF8C00" />
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
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    marginTop: 50, // Add extra margin for iOS status bar
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
    marginLeft: 8, // Move title closer to back arrow
  },
  headerRight: {
    width: 40,
  },
  reportsContainer: {
    flex: 1,
    marginBottom: 80, // Space for the floating nav bar
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  emptyStateContainer: {
    flex: 1,
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#666',
    fontSize: 16,
    marginTop: 16,
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

export default MissionReportsScreen;

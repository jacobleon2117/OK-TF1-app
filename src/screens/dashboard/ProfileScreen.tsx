import React from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

// Define navigation types that align with your app's structure
type RootStackParamList = {
  Dashboard: undefined;
  Messages: undefined;
  Calendar: undefined;
  Map: undefined;
  Profile: undefined;
  MissionReports: undefined;
};

// Correctly define the navigation prop type
type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const handleBackNavigation = () => {
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
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView style={styles.contentContainer}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <Image 
              source={require('../../assets/logos/OK-TF1-logo.jpg')} 
              style={styles.profileImage}
            />
            <View style={styles.nameContainer}>
              <Text style={styles.profileName}>Jacob Leon</Text>
              <Text style={styles.profileRole}>Handler</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.editButton}>
            <FontAwesome name="pencil" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
        
        {/* Settings and Privacy Section */}
        <View style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Settings and privacy</Text>
          
          {/* Settings Options */}
          <TouchableOpacity style={styles.settingItem}>
            <FontAwesome name="bell" size={20} color="#fff" style={styles.settingIcon} />
            <Text style={styles.settingText}>Notifications</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <FontAwesome name="location-arrow" size={20} color="#fff" style={styles.settingIcon} />
            <Text style={styles.settingText}>Location preferences</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <FontAwesome name="sign-out" size={20} color="#fff" style={styles.settingIcon} />
            <Text style={styles.settingText}>Login</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <FontAwesome name="universal-access" size={20} color="#fff" style={styles.settingIcon} />
            <Text style={styles.settingText}>Accessibility</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <FontAwesome name="globe" size={20} color="#fff" style={styles.settingIcon} />
            <Text style={styles.settingText}>Language and region</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <FontAwesome name="moon-o" size={20} color="#fff" style={styles.settingIcon} />
            <Text style={styles.settingText}>Dark mode</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <FontAwesome name="question-circle" size={20} color="#fff" style={styles.settingIcon} />
            <Text style={styles.settingText}>Need help?</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <FontAwesome name="trash" size={20} color="#fff" style={styles.settingIcon} />
            <Text style={styles.settingText}>Deactivate account</Text>
          </TouchableOpacity>
        </View>
        
        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
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
            onPress={() => navigation.navigate('MissionReports')}
          >
            <FontAwesome name="file-text-o" size={22} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navItem}
            // Already on Profile screen
          >
            <FontAwesome name="user" size={24} color="#FF8C00" />
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
    marginLeft: 8,
  },
  headerRight: {
    width: 40,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  profileCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  nameContainer: {
    marginLeft: 12,
  },
  profileName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileRole: {
    color: '#aaa',
    fontSize: 14,
  },
  editButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0,
  },
  settingIcon: {
    width: 24,
    marginRight: 16,
  },
  settingText: {
    color: '#fff',
    fontSize: 16,
  },
  bottomSpacer: {
    height: 100,
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  bottomNav: {
    height: 60,
    flexDirection: 'row',
    backgroundColor: '#111',
    borderRadius: 30,
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

export default ProfileScreen;
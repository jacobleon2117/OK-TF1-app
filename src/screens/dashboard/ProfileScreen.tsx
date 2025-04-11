import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  SafeAreaView, 
  Platform, 
  StatusBar as RNStatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
// Firebase imports - 
// import { auth, firestore } from '../../firebase/config';
// import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
// import { updateProfile } from 'firebase/auth';
import TabBarMain from '../../components/navigation/TabBarMain';
import * as ImagePicker from 'expo-image-picker';
import Header from '../../components/layout/Header';

const ProfileScreen = ({ navigation }) => {
  const [currentScreen, setCurrentScreen] = useState('Profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  
  // User profile state
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    bio: '',
    location: '',
    photoURL: null
  });
  
  // Form state (for editing)
  const [formData, setFormData] = useState({
    displayName: '',
    phoneNumber: '',
    bio: '',
    location: ''
  });

  // Handle screen changes
  const handleScreenChange = (screenName) => {
    setCurrentScreen(screenName);
    if (navigation && screenName !== 'Profile') {
      navigation.navigate(screenName);
    }
  };

  // Fetch user data on component mount
  useEffect(() => {
    // PLACEHOLDER: Firebase
    // This simulates loading user data for now
    const fetchUserData = async () => {
      try {
        // Mock user data - this will be replaced with actual Firebase Auth data
        const mockUserData = {
          displayName: 'Jacob Leon',
          email: 'jacob.leon@example.com',
          phoneNumber: '(555) 123-4567',
          photoURL: 'https://randomuser.me/api/portraits/men/32.jpg',
          bio: 'Handler',
          location: 'New York, NY'
        };
        
        // Set the profile data with mock data
        setProfileData(mockUserData);
        setFormData({
          displayName: mockUserData.displayName,
          phoneNumber: mockUserData.phoneNumber,
          bio: mockUserData.bio,
          location: mockUserData.location
        });
        
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to load profile data');
      } finally {
        // Add a slight delay to simulate network request
        setTimeout(() => setLoading(false), 800);
      }
    };
    
    fetchUserData();
  }, []);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      
      // Update the local state
      setProfileData(prev => ({
        ...prev,
        displayName: formData.displayName,
        phoneNumber: formData.phoneNumber,
        bio: formData.bio,
        location: formData.location
      }));
      
      // Simulate network request with timeout
      setTimeout(() => {
        setEditing(false);
        setSaving(false);
        Alert.alert('Success', 'Profile updated successfully');
      }, 1000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
      setSaving(false);
    }
  };

  // Handle photo upload
  const handleChangePhoto = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to your photo library');
        return;
      }
      
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      
      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setSaving(true);
        
        // Simulate upload with timeout
        setTimeout(() => {
          // Update local state with the selected image
          setProfileData(prev => ({
            ...prev,
            photoURL: imageUri
          }));
          
          setSaving(false);
          Alert.alert('Success', 'Profile picture updated');
        }, 1500);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Failed to update profile picture');
      setSaving(false);
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (editing) {
      // Discard changes
      setFormData({
        displayName: profileData.displayName,
        phoneNumber: profileData.phoneNumber,
        bio: profileData.bio,
        location: profileData.location
      });
    }
    setEditing(!editing);
  };

  // Render settings item
  const renderSettingItem = (icon, title, onPress) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <FontAwesome5 name={icon} size={20} color="white" style={styles.settingIcon} />
      <Text style={styles.settingText}>{title}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={[styles.background, styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.background}>
        <View style={styles.headerContainer}>
          <Header />
        </View>
        <KeyboardAvoidingView 
          style={{flex: 1}}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 40}
          >
    <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          >
          {/* Profile Section */}
          <View style={styles.profileHeader}>
            <Text style={styles.profileTitle}>Profile</Text>
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={toggleEditMode}
              disabled={saving}
            >
              <FontAwesome5 name="pen" size={16} color="white" />
            </TouchableOpacity>
          </View>
          
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileInfo}>
              {profileData.photoURL ? (
                <Image 
                  source={{ uri: profileData.photoURL }} 
                  style={styles.profileImage} 
                />
              ) : (
                <View style={[styles.profileImage, styles.profileImagePlaceholder]}>
                  <Text style={styles.profileImagePlaceholderText}>
                    {profileData.displayName ? profileData.displayName[0].toUpperCase() : 'U'}
                  </Text>
                </View>
              )}
              
              <View style={styles.nameContainer}>
                <Text style={styles.name}>{profileData.displayName || 'No Name'}</Text>
                <Text style={styles.role}>{profileData.bio || 'No Role'}</Text>
              </View>
            </View>
            
            {editing && (
              <TouchableOpacity 
                style={styles.editPhotoButton}
                onPress={handleChangePhoto}
                disabled={saving}
              >
                <FontAwesome5 name="camera" size={16} color="white" />
              </TouchableOpacity>
            )}
          </View>
          
          {/* Settings Section */}
          {editing ? (
            <View style={styles.form}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput 
                  style={styles.input}
                  value={formData.displayName}
                  onChangeText={(text) => handleInputChange('displayName', text)}
                  placeholder="Enter your name"
                  placeholderTextColor="#999"
                  editable={!saving}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.infoText}>{profileData.email}</Text>
                <Text style={styles.helperText}>Email cannot be changed</Text>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput 
                  style={styles.input}
                  value={formData.phoneNumber}
                  onChangeText={(text) => handleInputChange('phoneNumber', text)}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                  editable={!saving}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Location</Text>
                <TextInput 
                  style={styles.input}
                  value={formData.location}
                  onChangeText={(text) => handleInputChange('location', text)}
                  placeholder="Enter your location"
                  placeholderTextColor="#999"
                  editable={!saving}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Bio</Text>
                <TextInput 
                  style={[styles.input, styles.textArea]}
                  value={formData.bio}
                  onChangeText={(text) => handleInputChange('bio', text)}
                  placeholder="Tell us about yourself"
                  placeholderTextColor="#999"
                  multiline={true}
                  numberOfLines={4}
                  editable={!saving}
                />
              </View>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSaveProfile}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>Settings and privacy</Text>
              
              {renderSettingItem('bell', 'Notifications', () => Alert.alert('Notifications', 'Notifications settings'))}
              {renderSettingItem('location-arrow', 'Location preferences', () => Alert.alert('Location', 'Location settings'))}
              {renderSettingItem('sign-in-alt', 'Login', () => Alert.alert('Login', 'Login settings'))}
              {renderSettingItem('universal-access', 'Accessibility', () => Alert.alert('Accessibility', 'Accessibility settings'))}
              {renderSettingItem('globe', 'Language and region', () => Alert.alert('Language', 'Language settings'))}
              {renderSettingItem('moon', 'Dark mode', () => Alert.alert('Dark Mode', 'Dark mode settings'))}
              {renderSettingItem('question-circle', 'Need help?', () => Alert.alert('Help', 'Help center'))}
              {renderSettingItem('trash', 'Deactivate account', () => Alert.alert('Warning', 'Are you sure you want to deactivate your account?'))}
            </View>
          )}
        </ScrollView>
        </KeyboardAvoidingView>
        
        <View style={styles.footerContainer}>
          <TabBarMain 
            currentScreen={currentScreen}
            onScreenChange={handleScreenChange}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  background: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight || 0 : 0,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    width: '100%',
    position: 'absolute',
    top: Platform.OS === 'android' ? RNStatusBar.currentHeight || 0 : 0,
    zIndex: 10,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingTop: 60, // Provide space for header
    paddingBottom: 60, // Provide space for tab bar
  },
  contentContainer: {
    padding: 16,
  },
  // Profile Card Styles
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#222222',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  profileImagePlaceholder: {
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImagePlaceholderText: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
  },
  nameContainer: {
    justifyContent: 'center',
  },
  name: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  role: {
    color: '#BBBBBB',
    fontSize: 14,
  },
  editPhotoButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Settings Section Styles
  settingsSection: {
    backgroundColor: '#222222',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  settingIcon: {
    width: 24,
    marginRight: 16,
    textAlign: 'center',
  },
  settingText: {
    color: 'white',
    fontSize: 15,
  },
  // Form Styles
  form: {
    width: '100%',
    backgroundColor: '#222222',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#AAA',
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#333',
    color: '#FFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  infoText: {
    color: '#FFF',
    fontSize: 16,
    padding: 4,
  },
  helperText: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footerContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    zIndex: 10,
  },
});

export default ProfileScreen;

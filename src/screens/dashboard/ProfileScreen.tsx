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
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
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
          displayName: 'John Doe',
          email: 'john.doe@example.com',
          phoneNumber: '(555) 123-4567',
          photoURL: 'https://via.placeholder.com/150',
          bio: 'Frontend developer passionate about React Native',
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
        
        // For Firebase:
        // 1. Get currentUser from auth
        // 2. Get additional data from Firestore
        // 3. Set the profile data with actual user data
        
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
      
      // PLACEHOLDER: 
      // Simulate saving profile data
      
      // For now, just update the local state
      setProfileData(prev => ({
        ...prev,
        displayName: formData.displayName,
        phoneNumber: formData.phoneNumber,
        bio: formData.bio,
        location: formData.location
      }));
      
      // For Firebase:
      // 1. Update display name in Firebase Auth using updateProfile
      // 2. Update additional info in Firestore 
      // 3. Handle errors appropriately
      
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
        
        // PLACEHOLDER: This will be implemented the Firebase teammate
        // For now, just updated the local state with the selected image
        
        // For Firebase teammate:
        // 1. Upload image to Firebase Storage
        // 2. Get the download URL
        // 3. Update the user profile in Auth
        // 4. Update the user document in Firestore
        
        // Simulate upload with timeout
        setTimeout(() => {
          // Update local state with the selected image
          setProfileData(prev => ({
            ...prev,
            photoURL: imageUri // In the real implementation, this will be the Firebase Storage URL
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
        
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.profileHeader}>
            <Text style={styles.profileTitle}>Profile</Text>
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={toggleEditMode}
              disabled={saving}
            >
              <Text style={styles.editButtonText}>
                {editing ? 'Cancel' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileImageContainer}>
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
            
            {editing && (
              <TouchableOpacity 
                style={styles.changePhotoButton}
                onPress={handleChangePhoto}
                disabled={saving}
              >
                <Text style={styles.changePhotoText}>Change Photo</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Name</Text>
              {editing ? (
                <TextInput 
                  style={styles.input}
                  value={formData.displayName}
                  onChangeText={(text) => handleInputChange('displayName', text)}
                  placeholder="Enter your name"
                  placeholderTextColor="#999"
                  editable={!saving}
                />
              ) : (
                <Text style={styles.infoText}>{profileData.displayName || 'Not set'}</Text>
              )}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.infoText}>{profileData.email}</Text>
              <Text style={styles.helperText}>Email cannot be changed</Text>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone Number</Text>
              {editing ? (
                <TextInput 
                  style={styles.input}
                  value={formData.phoneNumber}
                  onChangeText={(text) => handleInputChange('phoneNumber', text)}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                  editable={!saving}
                />
              ) : (
                <Text style={styles.infoText}>{profileData.phoneNumber || 'Not set'}</Text>
              )}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Location</Text>
              {editing ? (
                <TextInput 
                  style={styles.input}
                  value={formData.location}
                  onChangeText={(text) => handleInputChange('location', text)}
                  placeholder="Enter your location"
                  placeholderTextColor="#999"
                  editable={!saving}
                />
              ) : (
                <Text style={styles.infoText}>{profileData.location || 'Not set'}</Text>
              )}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Bio</Text>
              {editing ? (
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
              ) : (
                <Text style={styles.infoText}>{profileData.bio || 'No bio provided'}</Text>
              )}
            </View>
            
            {editing && (
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
            )}
          </View>
        </ScrollView>
        
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
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#333',
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
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileImagePlaceholder: {
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImagePlaceholderText: {
    fontSize: 40,
    color: '#FFF',
    fontWeight: 'bold',
  },
  changePhotoButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#444',
  },
  changePhotoText: {
    color: '#FFF',
    fontSize: 14,
  },
  form: {
    width: '100%',
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
    backgroundColor: '#222',
    color: '#FFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
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
    marginBottom: 40,
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

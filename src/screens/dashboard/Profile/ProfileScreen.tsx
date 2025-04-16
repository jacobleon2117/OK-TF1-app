import React from 'react';
import { StyleSheet, View, StatusBar, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation';
import { BottomNavigation } from '@/components/common/dashboard';
import { ProfileCard, SettingsCard } from '@/components/dashboard/profile';
import { getSettingsItems, handleSettingAction, handleEditProfile } from '../Profile/profileUtils';
import { useAuth } from '@/context/AuthContext';
import HeaderWithNotifications from '@/components/common/HeaderWithNotifications';

const { height, width } = Dimensions.get('window');

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const settingsItems = getSettingsItems();

  // Use userData directly from auth context instead of getProfileData utility
  const { userData } = useAuth();

  const profileData = {
    displayName: userData?.displayName || 'User',
    role: userData?.role || 'Member',
  };

  const handleBackNavigation = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <HeaderWithNotifications
        title="Profile"
        showBackButton={true}
        onBackPress={handleBackNavigation}
      />

      <ScrollView style={styles.scrollContent}>
        <View style={styles.contentContainer}>
          <ProfileCard
            displayName={profileData.displayName}
            role={profileData.role}
            onEditPress={handleEditProfile}
          />

          <View style={styles.spacer} />

          <SettingsCard
            title="Settings and privacy"
            items={settingsItems}
            onItemPress={handleSettingAction}
          />

          {/* Spacer to ensure proper distance from bottom nav */}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      <BottomNavigation currentScreen="Profile" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    flex: 1,
  },
  spacer: {
    minHeight: 20,
    flex: 1,
  },
  bottomSpacer: {
    height: 120, // Increased height to ensure proper spacing from bottom nav
  },
});

export default ProfileScreen;

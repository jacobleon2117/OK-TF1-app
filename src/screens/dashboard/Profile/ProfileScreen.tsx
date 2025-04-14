import React from 'react';
import { StyleSheet, View, StatusBar, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation';
import { ScreenHeader, BottomNavigation } from '@/components/common/dashboard';
import { ProfileCard, SettingsCard } from '@/components/dashboard/profile';
import { DASHBOARD_NAV_ITEMS } from '@/constants/navigation';
import {
  getSettingsItems,
  handleSettingAction,
  getProfileData,
  handleEditProfile,
} from '../Profile/profileUtils';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const profileData = getProfileData();
  const settingsItems = getSettingsItems();

  const handleBackNavigation = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScreenHeader title="Profile" onBack={handleBackNavigation} />

      <ScrollView style={styles.contentContainer}>
        <ProfileCard
          profileImage={profileData.profileImageSource}
          displayName={profileData.displayName}
          role={profileData.role}
          onEditPress={handleEditProfile}
        />

        <SettingsCard
          title="Settings and privacy"
          items={settingsItems}
          onItemPress={handleSettingAction}
        />

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <BottomNavigation
        navigation={navigation}
        currentScreen="Profile"
        items={DASHBOARD_NAV_ITEMS}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  bottomSpacer: {
    height: 100,
  },
});

export default ProfileScreen;

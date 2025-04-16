// src/screens/dashboard/Map/MapScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenNavigationProp } from '@/types/navigation';
import { ScreenHeader, BottomNavigation } from '@/components/common/dashboard';
import { DASHBOARD_NAV_ITEMS } from '@/constants/navigation';
import { EmptyState } from '@/components/common/dashboard';

const MapScreen: React.FC = () => {
  const navigation = useNavigation<RootStackScreenNavigationProp<'Map'>>();

  const handleBackNavigation = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScreenHeader title="Mission Map" onBack={handleBackNavigation} />

      <View style={styles.content}>
        <EmptyState icon="map-o" message="Map functionality coming soon" />
      </View>

      <BottomNavigation navigation={navigation} currentScreen="Map" items={DASHBOARD_NAV_ITEMS} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
});

export default MapScreen;

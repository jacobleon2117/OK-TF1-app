import React from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenNavigationProp } from '@/types/navigation';
import { BottomNavigation, EmptyState } from '@/components/common/dashboard';
import HeaderWithNotifications from '@/components/common/HeaderWithNotifications';

const { height, width } = Dimensions.get('window');

const MapScreen: React.FC = () => {
  const navigation = useNavigation<RootStackScreenNavigationProp<'Map'>>();

  const handleBackNavigation = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <HeaderWithNotifications
        title="Mission Map"
        showBackButton={true}
        onBackPress={handleBackNavigation}
      />

      <View style={styles.content}>
        <View style={styles.mapCardContainer}>
          <EmptyState icon="map-o" message="Map functionality coming soon" />
        </View>
      </View>

      <BottomNavigation currentScreen="Map" />
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
    paddingHorizontal: 16,
    paddingBottom: 80, // Space for bottom nav
  },
  mapCardContainer: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapScreen;

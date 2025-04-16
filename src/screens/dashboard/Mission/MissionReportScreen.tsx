import React from 'react';
import { StyleSheet, View, StatusBar, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation';
import { BottomNavigation, EmptyState } from '@/components/common/dashboard';
import HeaderWithNotifications from '@/components/common/HeaderWithNotifications';

const { height, width } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<RootStackParamList>;

const MissionReportsScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleBackNavigation = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <HeaderWithNotifications
        title="Mission Reports"
        showBackButton={true}
        onBackPress={handleBackNavigation}
      />

      <View style={styles.content}>
        <View style={styles.reportsCard}>
          <EmptyState icon="file-text-o" message="No mission reports available" />
        </View>
      </View>

      <BottomNavigation currentScreen="MissionReports" />
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
  reportsCard: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MissionReportsScreen;

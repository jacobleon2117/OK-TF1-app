import React from 'react';
import { StyleSheet, View, StatusBar, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation';
import { ScreenHeader, BottomNavigation, EmptyState } from '@/components/common/dashboard';
import { DASHBOARD_NAV_ITEMS } from '@/constants/navigation';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const MissionReportsScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleBackNavigation = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScreenHeader title="Mission Reports" onBack={handleBackNavigation} />

      <ScrollView style={styles.reportsContainer}>
        <EmptyState icon="file-text-o" message="No mission reports available" />
      </ScrollView>

      <BottomNavigation
        navigation={navigation}
        currentScreen="MissionReports"
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
  reportsContainer: {
    flex: 1,
    marginBottom: 80,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});

export default MissionReportsScreen;

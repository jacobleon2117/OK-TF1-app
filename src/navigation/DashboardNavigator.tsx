import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';

// Import dashboard screens
import MessagesScreen from '../screens/dashboard/MessagesScreen';
import ScheduleScreen from '../screens/dashboard/ScheduleScreen';
import MissionReportScreen from '../screens/dashboard/MissionReportScreen';
import DashboardScreenTest from '../screens/dashboard/DashboardScreenTest'; // Use relative path

// Placeholder screens for screens not yet implemented
const PlaceholderScreen = ({ route }: any) => (
  <View style={styles.container}>
    <Text style={styles.text}>{route.name} Screen</Text>
    <Text style={styles.subText}>This screen will be implemented soon.</Text>
  </View>
);

// Use placeholder components where needed
const MapScreen = () => <PlaceholderScreen route={{ name: 'Map' }} />;
const ProfileScreen = () => <PlaceholderScreen route={{ name: 'Profile' }} />;

const Stack = createStackNavigator();

const DashboardNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#000' }
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreenTest} />
      <Stack.Screen name="Messages" component={MessagesScreen} />
      <Stack.Screen name="Calendar" component={ScheduleScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="MissionReports" component={MissionReportScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  subText: {
    fontSize: 16,
    color: '#aaa',
  }
});

export default DashboardNavigator;
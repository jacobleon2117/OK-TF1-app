import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import dashboard screens
import MessagesScreen from '../screens/dashboard/MessagesScreen';
// These imports would be added when those screens are implemented
// import DashboardHomeScreen from '../screens/dashboard/DashboardHomeScreen';
// import CalendarScreen from '../screens/dashboard/CalendarScreen';
// import MapScreen from '../screens/dashboard/MapScreen';
// import ProfileScreen from '../screens/dashboard/ProfileScreen';

// Temporary placeholder for screens not yet implemented
import { View, Text, StyleSheet } from 'react-native';

const PlaceholderScreen = ({ route }: any) => (
  <View style={styles.container}>
    <Text style={styles.text}>{route.name} Screen</Text>
    <Text style={styles.subText}>This screen will be implemented soon.</Text>
  </View>
);

// Create temporary components for screens not yet implemented
const DashboardHomeScreen = () => <PlaceholderScreen route={{ name: 'Dashboard Home' }} />;
const CalendarScreen = () => <PlaceholderScreen route={{ name: 'Calendar' }} />;
const MapScreen = () => <PlaceholderScreen route={{ name: 'Map' }} />;
const ProfileScreen = () => <PlaceholderScreen route={{ name: 'Profile' }} />;

// Define the stack navigator types
export type DashboardStackParamList = {
  Dashboard: undefined;
  Messages: undefined;
  Calendar: undefined;
  Map: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<DashboardStackParamList>();

const DashboardNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#000' }
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardHomeScreen} />
      <Stack.Screen name="Messages" component={MessagesScreen} />
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
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
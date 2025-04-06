import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';

// Import screens
import MessagesScreen from '../screens/dashboard/MessagesScreen';
// Import other screens as needed
// import DashboardScreen from '../screens/dashboard/DashboardScreen';
// import CalendarScreen from '../screens/dashboard/CalendarScreen';
// import MapScreen from '../screens/dashboard/MapScreen';
// import ProfileScreen from '../screens/dashboard/ProfileScreen';

// Define the navigation type
export type RootStackParamList = {
  Dashboard: undefined;
  Messages: undefined;
  Calendar: undefined;
  Map: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

// Placeholder screens for testing
const PlaceholderScreen = ({ route }: any) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
    <Text style={{ color: '#fff', fontSize: 24 }}>{route.name} Screen</Text>
  </View>
);

const DashboardScreen = () => <PlaceholderScreen route={{ name: 'Dashboard' }} />;
const CalendarScreen = () => <PlaceholderScreen route={{ name: 'Calendar' }} />;
const MapScreen = () => <PlaceholderScreen route={{ name: 'Map' }} />;
const ProfileScreen = () => <PlaceholderScreen route={{ name: 'Profile' }} />;

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Messages"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#000' },
        }}
      >
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Messages" component={MessagesScreen} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
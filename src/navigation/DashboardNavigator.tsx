import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation';

import MessagesScreen from '@/screens/dashboard/Message/MessagesScreen';
import ScheduleScreen from '@/screens/dashboard/Schedule/ScheduleScreen';
import MissionReportsScreen from '@/screens/dashboard/Profile/ProfileScreen';
import ProfileScreen from '@/screens/dashboard/Profile/ProfileScreen';
import HomeScreen from '@/screens/dashboard/HomeScreen';
import MapScreen from '@/screens/dashboard/Map/MapScreen';

const Stack = createStackNavigator<RootStackParamList>();

const DashboardNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#000' },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Dashboard" component={HomeScreen} />
      <Stack.Screen name="Messages" component={MessagesScreen} />
      <Stack.Screen name="Calendar" component={ScheduleScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="MissionReports" component={MissionReportsScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="Login" component={HomeScreen} />
      <Stack.Screen name="Signup" component={HomeScreen} />
      <Stack.Screen name="ForgotPassword" component={HomeScreen} />{' '}
    </Stack.Navigator>
  );
};

export default DashboardNavigator;

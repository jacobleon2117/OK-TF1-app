import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MessagesScreen from '@/screens/dashboard/Message/MessagesScreen';
import ScheduleScreen from '@/screens/dashboard/Schedule/ScheduleScreen';
import MissionReportScreen from '@/screens/dashboard/Mission/MissionReportScreen';
import ProfileScreen from '@/screens/dashboard/Profile/ProfileScreen';
import HomeScreen from '@/screens/dashboard/HomeScreen';

const Stack = createStackNavigator();

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
      <Stack.Screen name="Messages" component={MessagesScreen} />
      <Stack.Screen name="Calendar" component={ScheduleScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="MissionReports" component={MissionReportScreen} />
    </Stack.Navigator>
  );
};

export default DashboardNavigator;

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation';

import LoginScreen from '@/screens/auth/LoginScreen';
import SignupScreen from '@/screens/auth/SignupScreen';
import ForgotPasswordScreen from '@/screens/auth/ForgotPasswordScreen';

import HomeScreen from '@/screens/dashboard/HomeScreen';
import MessagesScreen from '@/screens/dashboard/Message/MessagesScreen';
import CalendarScreen from '@/screens/dashboard/Schedule/ScheduleScreen';
import MapScreen from '@/screens/dashboard/Map/MapScreen';
import MissionReportsScreen from '@/screens/dashboard/Mission/MissionReportScreen';
import ProfileScreen from '@/screens/dashboard/Profile/ProfileScreen';

import LoadingScreen from '@/components/LoadingScreen';
import { useAuth } from '@/context/AuthContext';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen visible={true} message="Loading..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#000' },
        }}
        initialRouteName={user ? 'Home' : 'Login'}
      >
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Messages" component={MessagesScreen} />
            <Stack.Screen name="Calendar" component={CalendarScreen} />
            <Stack.Screen name="Map" component={MapScreen} />
            <Stack.Screen name="MissionReports" component={MissionReportsScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

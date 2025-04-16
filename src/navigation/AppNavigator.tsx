// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation';

// Import your screens
import LoginScreen from '@/screens/auth/LoginScreen';
import SignupScreen from '@/screens/auth/SignupScreen';
import ForgotPasswordScreen from '@/screens/auth/ForgotPasswordScreen';
import HomeScreen from '@/screens/dashboard/HomeScreen';
import DashboardNavigator from './DashboardNavigator';

// Import authentication context
import { useAuth } from '@/context/AuthContext';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#000' },
        }}
      >
        {user ? (
          // If user is authenticated, show dashboard routes
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Dashboard" component={DashboardNavigator} />
          </>
        ) : (
          // If user is not authenticated, show auth routes
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

// Simple loading screen component
const LoadingScreen: React.FC = () => (
  <View
    style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}
  >
    <ActivityIndicator size="large" color="#FF8C00" />
  </View>
);

export default AppNavigator;

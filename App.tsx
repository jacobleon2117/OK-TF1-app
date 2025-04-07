<<<<<<< HEAD
// App.tsx
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation';
import { AuthProvider } from './src/context/AuthContext';
=======
// src/navigation/index.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';
>>>>>>> feature/dashboard-messaging

// Import auth screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Import Dashboard Navigator
import DashboardNavigator from './DashboardNavigator';

// Import auth context
import { useAuth } from '../context/AuthContext';

// Create stack navigator
const Stack = createStackNavigator();

// Auth navigator - for unauthenticated users
const AuthNavigator = () => {
  return (
<<<<<<< HEAD
    <AuthProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </AuthProvider>
  );
}
=======
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{ 
        headerShown: false,
        presentation: 'card'
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

// Root navigator - decides which navigator to show based on auth state
const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }
>>>>>>> feature/dashboard-messaging

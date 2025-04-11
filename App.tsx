// App.tsx
import React, { useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import NavigationService from './src/services/NavigationService';
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Import auth screens
import LoginScreen from './src/screens/auth/LoginScreen';
import SignupScreen from './src/screens/auth/SignupScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';

// Import dashboard screens
import HomeScreen from './src/screens/dashboard/HomeScreen';
import MapScreen from './src/screens/dashboard/MapScreen';
import ProfileScreen from './src/screens/dashboard/ProfileScreen';
import ScheduleScreen from './src/screens/dashboard/ScheduleScreen';
import MessageScreen from './src/screens/dashboard/MessageScreen';

// Import Dashboard Navigator
import DashboardNavigator from './src/navigation/DashboardNavigator';

import { createStackNavigator } from '@react-navigation/stack';

// Create stack navigator
const Stack = createStackNavigator();

// Auth navigator - for unauthenticated users
const AuthNavigator = () => {
  return (
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
const AppContent = () => {
  const { user, loading } = useAuth();
  const navigationRef = useRef(null);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        // Set the navigation reference in NavigationService
        NavigationService.setNavigation(navigationRef.current);
      }}
    >
      {user ? (
        <DashboardNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <AppContent />
      <Toast />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

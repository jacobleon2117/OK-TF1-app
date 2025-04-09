<<<<<<< HEAD
// App.tsx
import React, { useRef } from 'react'; // Add useRef
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import NavigationService from './src/services/NavigationService'; // Import NavigationService

// Import your screens
import HomeScreen from './src/screens/dashboard/HomeScreen';
import MapScreen from './src/screens/dashboard/MapScreen';
import ProfileScreen from './src/screens/dashboard/ProfileScreen';
import ScheduleScreen from './src/screens/dashboard/ScheduleScreen';
import MessageScreen from './src/screens/dashboard/MessageScreen';

// Create a stack navigator
const Stack = createStackNavigator();

export default function App() {
  // Create navigation reference
  const navigationRef = useRef(null);

  return (
    <>
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        // Set the navigation reference in NavigationService
        NavigationService.setNavigation(navigationRef.current);
      }}
    >
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerShown: false // Hide the default header
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen}/>
        <Stack.Screen name="Schedule" component={ScheduleScreen}/>
        <Stack.Screen name="Message" component={MessageScreen}/>
        {/* Add other screens here as you create them */}
      </Stack.Navigator>
    </NavigationContainer>
     <Toast />
     </>
=======
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
>>>>>>> origin/feature/dashboard-map
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

<<<<<<< HEAD
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
=======
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
>>>>>>> origin/feature/dashboard-map

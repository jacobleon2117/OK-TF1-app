// src/navigation/index.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';

// Import auth screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import LoadingScreen from '../components/LoadingScreen';

// Import auth context
import { useAuth } from '../context/AuthContext';

// Create a temporary placeholder screen
const PlaceholderScreen = () => (
  <View style={styles.placeholderContainer}>
    <Text style={styles.placeholderText}>
      Authentication successful! Dashboard will be implemented in feature/dashboard-home branch.
    </Text>
  </View>
);

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

// Main navigator - just a placeholder for now
const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PlaceholderHome" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
};

// Root navigator - decides which navigator to show based on auth state
const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <LoadingScreen visible={true} overlay={false} message="Loading..." />
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AppNavigator;
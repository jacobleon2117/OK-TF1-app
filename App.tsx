// App.tsx
import React, { useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import NavigationService from './src/services/NavigationService';

// Import dashboard screens
import HomeScreen from './src/screens/dashboard/HomeScreen';
import MapScreen from './src/screens/dashboard/MapScreen';
import ProfileScreen from './src/screens/dashboard/ProfileScreen';
import ScheduleScreen from './src/screens/dashboard/ScheduleScreen';
import MessageScreen from './src/screens/dashboard/MessageScreen';

import { createStackNavigator } from '@react-navigation/stack';

// Create stack navigator
const Stack = createStackNavigator();

export default function App() {
  const navigationRef = useRef(null);

  return (
    <>
      <StatusBar style="light" />
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

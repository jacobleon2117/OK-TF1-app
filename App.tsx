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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

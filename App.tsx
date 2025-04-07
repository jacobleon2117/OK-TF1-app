// This is the main entry point of your React Native application
// It sets up the navigation and initial screen
// When you create new screens, you can import them here and add them to the stack navigator
// App.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import your screens here and add them to the stack navigator below
import HomeScreen from './src/screens/dashboard/HomeScreen';// import MapScreen from './src/screens/map/MapScreen';
// Import other screens as you create them

// Create a stack navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerShown: false // Hide the default header since you have your own
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* <Stack.Screen name="Map" component={MapScreen} /> */}
        {/* Add other screens here as you create them */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

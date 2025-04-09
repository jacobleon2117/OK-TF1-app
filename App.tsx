// App.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
// Import your screens here and add them to the stack navigator below
import HomeScreen from './src/screens/dashboard/HomeScreen';
import MapScreen from './src/screens/map/MapScreen';
// Import other screens as you create them

// Create a stack navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <>
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerShown: false // Hide the default header
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen}/>
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

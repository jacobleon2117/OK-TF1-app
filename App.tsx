import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation';
import { AuthProvider } from './src/context/AuthContext';
import Mapbox from '@rnmapbox/maps';

Mapbox.setAccessToken(
  'pk.eyJ1Ijoiamxlb24yMTE3IiwiYSI6ImNtOWVxeHY0cTFoZzgyam92OW84OTJreGcifQ.0rHB-_cc8vgZhSUPyNzI4A'
);

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </AuthProvider>
  );
}

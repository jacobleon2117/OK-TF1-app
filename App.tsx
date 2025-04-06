// App.tsx
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </AuthProvider>
  );
}


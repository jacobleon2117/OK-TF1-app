// src/__tests__/App.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../../App';

// Mock the dependencies
jest.mock('expo-status-bar', () => ({
  StatusBar: function StatusBar() { return null; }
}));

// Mock AppNavigator with a testID
jest.mock('../navigation', () => function MockAppNavigator() {
  return <div data-testid="app-navigator">AppNavigator</div>;
});

jest.mock('../context/AuthContext', () => ({
  AuthProvider: function AuthProvider({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  }
}));

describe('App Component', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<App />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders AppNavigator inside AuthProvider', () => {
    const { getByTestId } = render(<App />);
    
    // Use testID instead of text
    expect(getByTestId('app-navigator')).toBeTruthy();
  });
});
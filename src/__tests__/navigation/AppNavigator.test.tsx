// src/__tests__/navigation/AppNavigator.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import AppNavigator from '../../navigation';
import { useAuth } from '../../context/AuthContext';

// Mock the AuthContext hook
jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock the navigation components properly
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: function NavigationContainer(props: { children: React.ReactNode }) { 
    return <>{props.children}</>; 
  },
}));

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: jest.fn(() => ({
    Navigator: function Navigator(props: { children: React.ReactNode }) { 
      return <>{props.children}</>; 
    },
    Screen: function Screen(props: { name: string }) { 
      return <div data-testid={props.name}>{props.name}</div>; 
    }
  })),
}));

// Mock dashboard navigator
jest.mock('../../navigation/DashboardNavigator', () => 
  function DashboardNavigator() {
    return <div data-testid="DashboardNavigator">DashboardNavigator</div>;
  }
);

// Mock loading component
jest.mock('@/components/LoadingScreen', () => 
  function LoadingScreen() {
    return <div data-testid="loading-indicator">Loading...</div>;
  }
);

// Mock auth screens
jest.mock('../../screens/auth/LoginScreen', () => 
  function Login() {
    return <div data-testid="Login">Login</div>;
  }
);

jest.mock('../../screens/auth/SignupScreen', () => 
  function Signup() {
    return <div data-testid="Signup">Signup</div>;
  }
);

jest.mock('../../screens/auth/ForgotPasswordScreen', () => 
  function ForgotPassword() {
    return <div data-testid="ForgotPassword">ForgotPassword</div>;
  }
);

describe('AppNavigator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render auth stack when user is not authenticated', () => {
    // Mock user as not authenticated
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
    });

    const { getByTestId } = render(<AppNavigator />);
    
    // Use testID instead of text
    expect(getByTestId('Login')).toBeTruthy();
  });

  it('should render app stack when user is authenticated', () => {
    // Mock user as authenticated
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: '123', email: 'test@example.com' },
      loading: false,
    });

    const { getByTestId } = render(<AppNavigator />);
    
    // Use testID instead of text
    expect(getByTestId('DashboardNavigator')).toBeTruthy();
  });

  it('should render loading screen when authentication is in progress', () => {
    // Mock loading state
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: true,
    });

    const { getByTestId } = render(<AppNavigator />);
    
    // Use testID for loading indicator
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });
});
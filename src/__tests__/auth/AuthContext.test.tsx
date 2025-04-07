// src/__tests__/auth/AuthContext.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Text, Button, View } from 'react-native';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  sendPasswordResetEmail
} from 'firebase/auth';

// Mock the Firebase auth functions
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn((auth, callback) => {
    // Initialize with null (not logged in)
    callback(null);
    // Return unsubscribe function
    return jest.fn();
  }),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
}));

// Test component that uses the auth context
const TestComponent = () => {
  const { user, loading, login, signup, logout, resetPassword, error, setError } = useAuth();

  return (
    <View>
      <Text testID="loading-status">{loading ? 'Loading' : 'Not Loading'}</Text>
      <Text testID="user-status">{user ? 'Logged In' : 'Logged Out'}</Text>
      <Text testID="error-message">{error || 'No Error'}</Text>
      
      <Button 
        testID="login-button" 
        title="Login" 
        onPress={() => login('test@example.com', 'password', '123456')} 
      />
      
      <Button 
        testID="signup-button" 
        title="Sign Up" 
        onPress={() => signup('Test User', 'test@example.com', 'password', '123456')} 
      />
      
      <Button 
        testID="logout-button" 
        title="Logout" 
        onPress={() => logout()} 
      />
      
      <Button 
        testID="reset-button" 
        title="Reset Password" 
        onPress={() => resetPassword('test@example.com', '123456')} 
      />
    </View>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children and provides initial auth state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user-status').props.children).toBe('Logged Out');
    expect(screen.getByTestId('loading-status').props.children).toBe('Not Loading');
    expect(screen.getByTestId('error-message').props.children).toBe('No Error');
  });

  it('handles login successfully', async () => {
    // Mock successful login
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: { uid: '123', email: 'test@example.com' },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.press(screen.getByTestId('login-button'));

    // Should call Firebase signInWithEmailAndPassword with correct params
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com',
      'password'
    );
  });

  it('handles login error', async () => {
    // Mock login error
    const mockError = new Error('Invalid credentials');
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(mockError);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.press(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalled();
    });
  });

  it('handles signup successfully', async () => {
    // Mock successful signup
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: { uid: '123', email: 'test@example.com' },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.press(screen.getByTestId('signup-button'));

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com',
      'password'
    );
  });

  it('handles logout', async () => {
    // Mock successful logout
    (firebaseSignOut as jest.Mock).mockResolvedValueOnce(undefined);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.press(screen.getByTestId('logout-button'));

    expect(firebaseSignOut).toHaveBeenCalled();
  });
  
  it('handles password reset', async () => {
    // Mock successful password reset
    (sendPasswordResetEmail as jest.Mock).mockResolvedValueOnce(undefined);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.press(screen.getByTestId('reset-button'));

    expect(sendPasswordResetEmail).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com'
    );
  });
});
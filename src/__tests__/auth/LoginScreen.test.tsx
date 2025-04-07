// src/__tests__/auth/LoginScreen.test.tsx
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import LoginScreen from '@/screens/auth/LoginScreen';
import { useAuth } from '@/context/AuthContext';
import { setupAlertMock, clearAlertMock, expectAlertToHaveBeenCalledWith } from '../utils/alertMock';
import { asyncAct } from '../utils/testUtils';
import { createMockNavigation } from '../utils/testUtils';

// Define types for AuthContext and navigation
type AuthContextType = {
  login: (email: string, password: string, orgCode: string) => Promise<void>;
  error: string | null;
  setError: (error: string | null) => void;
};

type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

// Mock the AuthContext
jest.mock('@/context/AuthContext', () => ({
  __esModule: true,
  useAuth: jest.fn().mockReturnValue({
    login: jest.fn().mockResolvedValue({}),
    error: null,
    setError: jest.fn(),
  } as AuthContextType),
}));

describe('LoginScreen', () => {
  let mockAlert: jest.SpyInstance;
  let navigation: ReturnType<typeof createMockNavigation<AuthStackParamList, 'Login'>>;

  beforeEach(() => {
    mockAlert = setupAlertMock();
    navigation = createMockNavigation<AuthStackParamList, 'Login'>('Login');
    jest.clearAllMocks();
  });

  afterEach(() => {
    clearAlertMock();
  });

  const fillOutForm = (email: string, password: string) => {
    const emailInput = screen.getByPlaceholderText('Enter your email address');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    
    fireEvent.changeText(emailInput, email);
    fireEvent.changeText(passwordInput, password);
  };

  test('renders initial form fields', () => {
    render(<LoginScreen navigation={navigation} />);
    
    expect(screen.getByPlaceholderText('Enter your email address')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter your password')).toBeTruthy();
    expect(screen.getByText('Login')).toBeTruthy();
  });

  test('shows validation errors for empty fields', async () => {
    render(<LoginScreen navigation={navigation} />);
    const loginButton = screen.getByText('Login');
    
    await asyncAct(async () => {
      fireEvent.press(loginButton);
    });
    
    expectAlertToHaveBeenCalledWith(
      mockAlert, 
      'Error', 
      'Please enter your email'
    );
  });

  test('shows validation error for invalid email format', async () => {
    render(<LoginScreen navigation={navigation} />);
    
    fillOutForm('invalid-email', 'password123');
    
    const loginButton = screen.getByText('Login');
    
    await asyncAct(async () => {
      fireEvent.press(loginButton);
    });
    
    expectAlertToHaveBeenCalledWith(
      mockAlert, 
      'Error', 
      'Please enter your email'
    );
  });

  test('calls login function with correct credentials', async () => {
    const mockLogin = jest.fn().mockResolvedValue({});
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      error: null,
      setError: jest.fn(),
    });
    
    render(<LoginScreen navigation={navigation} />);
    fillOutForm('test@example.com', 'password123');
    
    const loginButton = screen.getByText('Login');
    
    await asyncAct(async () => {
      fireEvent.press(loginButton);
    });
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
        '123456'
      );
    });
  });

  test('navigates to signup page when signup link is pressed', () => {
    render(<LoginScreen navigation={navigation} />);
    
    fireEvent.press(screen.getByText('Sign up'));
    
    expect(navigation.navigate).toHaveBeenCalledWith('Signup');
  });

  test('navigates to forgot password page when forgot password link is pressed', () => {
    render(<LoginScreen navigation={navigation} />);
    
    fireEvent.press(screen.getByText('Forgot Password?'));
    
    expect(navigation.navigate).toHaveBeenCalledWith('ForgotPassword');
  });
});
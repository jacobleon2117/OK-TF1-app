// src/__tests__/auth/SignupScreen.test.tsx
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import SignupScreen from '@/screens/auth/SignupScreen';
import { useAuth } from '@/context/AuthContext';
import { setupAlertMock, clearAlertMock, expectAlertToHaveBeenCalledWith } from '../utils/alertMock';
import { asyncAct } from '../utils/testUtils';
import { createMockNavigation } from '../utils/testUtils';

// Define types for AuthContext
type AuthContextType = {
  signup: (name: string, email: string, password: string, orgCode: string) => Promise<void>;
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
    signup: jest.fn().mockResolvedValue({}),
    error: null,
    setError: jest.fn(),
  } as AuthContextType),
}));

describe('SignupScreen', () => {
  let mockAlert: jest.SpyInstance;
  let navigation: ReturnType<typeof createMockNavigation<AuthStackParamList, 'Signup'>>;

  beforeEach(() => {
    mockAlert = setupAlertMock();
    navigation = createMockNavigation<AuthStackParamList, 'Signup'>('Signup');
    jest.clearAllMocks();
  });

  afterEach(() => {
    clearAlertMock();
  });

  const fillOutForm = (
    name: string, 
    email: string, 
    orgCode: string, 
    password: string, 
    confirmPassword: string
  ) => {
    const nameInput = screen.getByPlaceholderText('Enter your full name');
    const emailInput = screen.getByPlaceholderText('Enter your email address');
    const orgCodeInput = screen.getByPlaceholderText('Enter your organization code');
    const passwordInput = screen.getByPlaceholderText('Create a password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
    
    fireEvent.changeText(nameInput, name);
    fireEvent.changeText(emailInput, email);
    fireEvent.changeText(orgCodeInput, orgCode);
    fireEvent.changeText(passwordInput, password);
    fireEvent.changeText(confirmPasswordInput, confirmPassword);
  };

  test('renders initial form fields', () => {
    render(<SignupScreen navigation={navigation} />);
    
    expect(screen.getByPlaceholderText('Enter your full name')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter your email address')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter your organization code')).toBeTruthy();
    expect(screen.getByPlaceholderText('Create a password')).toBeTruthy();
    expect(screen.getByPlaceholderText('Confirm your password')).toBeTruthy();
    expect(screen.getByText('Sign Up')).toBeTruthy();
  });

  test('shows validation errors for empty fields', async () => {
    render(<SignupScreen navigation={navigation} />);
    const signupButton = screen.getByText('Sign Up');
    
    await asyncAct(async () => {
      fireEvent.press(signupButton);
    });
    
    expectAlertToHaveBeenCalledWith(
      mockAlert, 
      'Error', 
      'Please enter your full name'
    );
  });

  test('shows validation error for invalid email format', async () => {
    render(<SignupScreen navigation={navigation} />);
    
    fillOutForm('Test User', 'invalid-email', '123456', 'password123', 'password123');
    
    const signupButton = screen.getByText('Sign Up');
    
    await asyncAct(async () => {
      fireEvent.press(signupButton);
    });
    
    expectAlertToHaveBeenCalledWith(
      mockAlert, 
      'Error', 
      'Please enter your email'
    );
  });

  test('calls signup function with correct credentials', async () => {
    const mockSignup = jest.fn().mockResolvedValue({});
    (useAuth as jest.Mock).mockReturnValue({
      signup: mockSignup,
      error: null,
      setError: jest.fn(),
    });
    
    render(<SignupScreen navigation={navigation} />);
    
    fillOutForm('Test User', 'test@example.com', '123456', 'password123', 'password123');
    
    const signupButton = screen.getByText('Sign Up');
    
    await asyncAct(async () => {
      fireEvent.press(signupButton);
    });
    
    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith(
        'Test User',
        'test@example.com',
        'password123',
        '123456'
      );
    });
  });

  test('navigates to login page when back to login link is pressed', () => {
    render(<SignupScreen navigation={navigation} />);
    
    fireEvent.press(screen.getByText('Back to login'));
    
    expect(navigation.navigate).toHaveBeenCalledWith('Login');
  });
});
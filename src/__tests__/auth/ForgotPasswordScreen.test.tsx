// src/__tests__/auth/ForgotPasswordScreen.test.tsx
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import ForgotPasswordScreen from '@/screens/auth/ForgotPasswordScreen';
import { useAuth } from '@/context/AuthContext';
import { setupAlertMock, clearAlertMock, expectAlertToHaveBeenCalledWith } from '../utils/alertMock';
import { asyncAct } from '../utils/testUtils';
import { createMockNavigation } from '../utils/testUtils';

// Define types for AuthContext
type AuthContextType = {
  resetPassword: (email: string, orgCode: string) => Promise<void>;
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
    resetPassword: jest.fn().mockResolvedValue({}),
    error: null,
    setError: jest.fn(),
  } as AuthContextType),
}));

describe('ForgotPasswordScreen', () => {
  let mockAlert: jest.SpyInstance;
  let navigation: ReturnType<typeof createMockNavigation<AuthStackParamList, 'ForgotPassword'>>;

  beforeEach(() => {
    mockAlert = setupAlertMock();
    navigation = createMockNavigation<AuthStackParamList, 'ForgotPassword'>('ForgotPassword');
    jest.clearAllMocks();
  });

  afterEach(() => {
    clearAlertMock();
  });

  const fillOutForm = (fullName: string, email: string) => {
    const nameInput = screen.getByPlaceholderText('Enter your account name');
    const emailInput = screen.getByPlaceholderText('Enter your account email address');
    
    fireEvent.changeText(nameInput, fullName);
    fireEvent.changeText(emailInput, email);
  };

  test('renders the email input and submit button', () => {
    render(<ForgotPasswordScreen navigation={navigation} />);
    
    expect(screen.getByPlaceholderText('Enter your account name')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter your account email address')).toBeTruthy();
    expect(screen.getByText('Reset Password')).toBeTruthy();
  });

  test('shows validation error for empty full name', async () => {
    render(<ForgotPasswordScreen navigation={navigation} />);
    
    const resetButton = screen.getByText('Reset Password');
    
    await asyncAct(async () => {
      fireEvent.press(resetButton);
    });
    
    expectAlertToHaveBeenCalledWith(
      mockAlert, 
      'Error', 
      'Please enter your full name'
    );
  });

  test('shows validation error for empty email', async () => {
    render(<ForgotPasswordScreen navigation={navigation} />);
    
    // Fill in name but leave email empty
    const nameInput = screen.getByPlaceholderText('Enter your account name');
    fireEvent.changeText(nameInput, 'Test User');
    
    const resetButton = screen.getByText('Reset Password');
    
    await asyncAct(async () => {
      fireEvent.press(resetButton);
    });
    
    expectAlertToHaveBeenCalledWith(
      mockAlert, 
      'Error', 
      'Please enter your email'
    );
  });

  test('calls resetPassword function with correct parameters', async () => {
    const mockResetPassword = jest.fn().mockResolvedValue({});
    (useAuth as jest.Mock).mockReturnValue({
      resetPassword: mockResetPassword,
      error: null,
      setError: jest.fn(),
    });
    
    render(<ForgotPasswordScreen navigation={navigation} />);
    fillOutForm('Test User', 'test@example.com');
    
    const resetButton = screen.getByText('Reset Password');
    
    await asyncAct(async () => {
      fireEvent.press(resetButton);
    });
    
    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith(
        'test@example.com',
        '123456'
      );
    });
  });

  test('navigates back to login page when back to login link is pressed', () => {
    render(<ForgotPasswordScreen navigation={navigation} />);
    
    fireEvent.press(screen.getByText('Back to login'));
    
    expect(navigation.navigate).toHaveBeenCalledWith('Login');
  });
});
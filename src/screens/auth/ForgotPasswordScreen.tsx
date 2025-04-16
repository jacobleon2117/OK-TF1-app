import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../context/AuthContext';
import BackgroundGrid from '@/components/common/auth/BackgroundGrid';
import LoadingScreen from '@/components/LoadingScreen';
import {
  AuthHeader,
  FullNameField,
  EmailField,
  AuthButton,
  LinkText,
  ResetPasswordSuccess,
} from '@/components/common/auth';

type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

type ForgotPasswordScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;
};

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [nameError, setNameError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');

  const { resetPassword, error, setError } = useAuth();

  useEffect(() => {
    if (Platform.OS === 'ios') {
      const timer = setTimeout(() => {}, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  const validateForm = (): boolean => {
    let isValid = true;

    if (!fullName.trim()) {
      setNameError('Full name is required');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else {
      setEmailError('');
    }

    return isValid;
  };

  const handleResetPassword = async (): Promise<void> => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await resetPassword(email, '123456');
      setEmailSent(true);
    } catch (err: any) {
      Alert.alert('Reset Password Failed', error || 'An error occurred while sending reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    setFullName('');
    setEmail('');
    navigation.navigate('Login');
  };

  return (
    <BackgroundGrid>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <AuthHeader />

            {emailSent ? (
              <ResetPasswordSuccess email={email} onBackToLogin={navigateToLogin} />
            ) : (
              <>
                <FullNameField
                  value={fullName}
                  onChangeText={text => {
                    setFullName(text);
                    setError(null);
                  }}
                  error={nameError}
                />

                <EmailField
                  value={email}
                  onChangeText={text => {
                    setEmail(text);
                    setError(null);
                  }}
                  error={emailError}
                />

                {error && <Text style={styles.errorText}>{error}</Text>}

                <View style={styles.backContainer}>
                  <LinkText text="Back to login" onPress={navigateToLogin} />
                </View>

                <AuthButton
                  title="Reset Password"
                  onPress={handleResetPassword}
                  isLoading={isLoading}
                  disabled={isLoading}
                />
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <LoadingScreen visible={isLoading} message="Sending reset email..." overlay={true} />
    </BackgroundGrid>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  backContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    marginBottom: 8,
  },
  errorText: {
    color: '#ff6b6b',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default ForgotPasswordScreen;

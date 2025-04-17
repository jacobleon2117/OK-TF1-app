import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '@/context/AuthContext';
import BackgroundGrid from '@/components/common/auth/BackgroundGrid';
import LoadingScreen from '@/components/LoadingScreen';
import { EmailField, AuthButton, LinkText, ResetPasswordSuccess } from '@/components/common/auth';

type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

type ForgotPasswordScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;
};

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>('');
  const scrollViewRef = useRef<ScrollView>(null);

  const { resetPassword, error, setError } = useAuth();

  useEffect(() => {
    if (Platform.OS === 'ios') {
      const timer = setTimeout(() => {}, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  const validateForm = (): boolean => {
    let isValid = true;

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
    setEmail('');
    navigation.navigate('Login');
  };

  return (
    <BackgroundGrid>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={false}
          >
            <View style={styles.content}>
              {/* New TaskCom Title */}
              <View style={styles.titleContainer}>
                <Text style={styles.title}>TaskCom</Text>
              </View>

              {emailSent ? (
                <ResetPasswordSuccess email={email} onBackToLogin={navigateToLogin} />
              ) : (
                <>
                  <Text style={styles.instructionText}>
                    Enter your email address and we'll send you a link to reset your password.
                  </Text>

                  <EmailField
                    value={email}
                    onChangeText={text => {
                      setEmail(text);
                      setError(null);
                    }}
                    error={emailError}
                  />

                  <View style={styles.errorContainer}>
                    {error && <Text style={styles.errorText}>{error}</Text>}
                  </View>

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
      </TouchableWithoutFeedback>
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
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  instructionText: {
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  backContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    marginBottom: 8,
    height: 20, // Fixed height to prevent shifting
  },
  errorContainer: {
    minHeight: 20, // Fixed height for error text to prevent shifting
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#ff6b6b',
    textAlign: 'center',
  },
});

export default ForgotPasswordScreen;

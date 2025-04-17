import React, { useEffect, useRef } from 'react';
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
import { useForm } from '@/hooks/useForm';
import { validateEmail, validatePassword } from '@/utils/validation';
import BackgroundGrid from '@/components/common/auth/BackgroundGrid';
import LoadingScreen from '@/components/LoadingScreen';
import { EmailField, PasswordField, AuthButton, LinkText } from '@/components/common/auth';

type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

type LoginScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'Login'>;
};

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login, error, setError } = useAuth();
  const scrollViewRef = useRef<ScrollView>(null);

  const validateForm = (values: LoginFormValues) => {
    return {
      email: validateEmail(values.email),
      password: validatePassword(values.password),
    };
  };

  const { values, errors, isSubmitting, handleChange, handleSubmit, reset } =
    useForm<LoginFormValues>({
      initialValues: { email: '', password: '' },
      validate: validateForm,
      onSubmit: async formValues => {
        try {
          await login(formValues.email, formValues.password, '123456');
        } catch (err) {
          Alert.alert('Login Failed', error || 'An error occurred during login');
        }
      },
    });

  useEffect(() => {
    if (Platform.OS === 'ios') {
      const timer = setTimeout(() => {}, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  const navigateToForgotPassword = () => {
    reset();
    navigation.navigate('ForgotPassword');
  };

  const navigateToSignup = () => {
    reset();
    navigation.navigate('Signup');
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
              <View style={styles.titleContainer}>
                <Text style={styles.title}>TaskCom</Text>
              </View>

              <EmailField
                value={values.email}
                onChangeText={text => {
                  handleChange('email', text);
                  setError(null);
                }}
                error={errors.email}
              />

              <PasswordField
                value={values.password}
                onChangeText={text => {
                  handleChange('password', text);
                  setError(null);
                }}
                error={errors.password}
              />

              <View style={styles.forgotContainer}>
                <LinkText text="Forgot Password?" onPress={navigateToForgotPassword} />
              </View>

              {error && <Text style={styles.errorText}>{error}</Text>}

              <AuthButton
                title="Login"
                onPress={handleSubmit}
                isLoading={isSubmitting}
                disabled={isSubmitting}
              />

              <View style={styles.signupContainer}>
                <Text style={styles.whiteText}>Don't have an account?</Text>
                <LinkText text=" Sign up" onPress={navigateToSignup} bold />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      <LoadingScreen visible={isSubmitting} message="Logging in..." overlay={true} />
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
    marginBottom: 40,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  forgotContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    marginBottom: 8,
    height: 20,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    height: 20,
  },
  whiteText: {
    color: 'white',
  },
  errorText: {
    color: '#ff6b6b',
    marginBottom: 10,
    textAlign: 'center',
    minHeight: 20,
  },
});

export default LoginScreen;

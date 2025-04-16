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
import { useAuth } from '../../context/AuthContext';
import { useForm } from '@/hooks/useForm';
import {
  validateEmail,
  validatePassword,
  validateFullName,
  validateConfirmPassword,
  validateOrganizationCode,
} from '@/utils/validation';
import BackgroundGrid from '@/components/common/auth/BackgroundGrid';
import LoadingScreen from '@/components/LoadingScreen';
import {
  EmailField,
  PasswordField,
  FullNameField,
  OrganizationCodeField,
  AuthButton,
  LinkText,
} from '@/components/common/auth';

type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

type SignupScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'Signup'>;
};

interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  organizationCode: string;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const { signup, error, setError } = useAuth();
  const scrollViewRef = useRef<ScrollView>(null);

  const validateForm = (values: SignupFormValues) => {
    return {
      name: validateFullName(values.name),
      email: validateEmail(values.email),
      password: validatePassword(values.password),
      confirmPassword: validateConfirmPassword(values.password, values.confirmPassword),
      organizationCode: validateOrganizationCode(values.organizationCode),
    };
  };

  const { values, errors, isSubmitting, handleChange, handleSubmit, reset } =
    useForm<SignupFormValues>({
      initialValues: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        organizationCode: '',
      },
      validate: validateForm,
      onSubmit: async formValues => {
        try {
          await signup(
            formValues.name,
            formValues.email,
            formValues.password,
            formValues.organizationCode
          );
          Alert.alert('Success', 'Account created successfully!', [
            { text: 'OK', onPress: () => navigateToLogin() },
          ]);
        } catch (err) {
          Alert.alert('Signup Failed', error || 'An error occurred during signup');
        }
      },
    });

  useEffect(() => {
    if (Platform.OS === 'ios') {
      const timer = setTimeout(() => {}, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  const navigateToLogin = () => {
    reset();
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
          >
            <View style={styles.content}>
              {/* New TaskCom Title */}
              <View style={styles.titleContainer}>
                <Text style={styles.title}>TaskCom</Text>
              </View>

              <FullNameField
                value={values.name}
                onChangeText={text => {
                  handleChange('name', text);
                  setError(null);
                }}
                error={errors.name}
                autoCapitalize="words"
              />

              <EmailField
                value={values.email}
                onChangeText={text => {
                  handleChange('email', text);
                  setError(null);
                }}
                error={errors.email}
                autoCapitalize="none"
              />

              <PasswordField
                value={values.password}
                onChangeText={text => {
                  handleChange('password', text);
                  setError(null);
                }}
                error={errors.password}
                autoCapitalize="none"
              />

              <PasswordField
                label="Confirm Password"
                value={values.confirmPassword}
                onChangeText={text => {
                  handleChange('confirmPassword', text);
                  setError(null);
                }}
                placeholder="Confirm your password"
                error={errors.confirmPassword}
                autoCapitalize="none"
              />

              <OrganizationCodeField
                value={values.organizationCode}
                onChangeText={text => {
                  handleChange('organizationCode', text);
                  setError(null);
                }}
                error={errors.organizationCode}
                autoCapitalize="characters"
              />

              <View style={styles.errorContainer}>
                {error && <Text style={styles.errorText}>{error}</Text>}
              </View>

              <View style={styles.backContainer}>
                <LinkText text="Back to login" onPress={navigateToLogin} />
              </View>

              <AuthButton
                title="Sign Up"
                onPress={handleSubmit}
                isLoading={isSubmitting}
                disabled={isSubmitting}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      <LoadingScreen visible={isSubmitting} message="Creating account..." overlay={true} />
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
  backContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    marginBottom: 8,
    height: 20, // Fixed height to prevent shifting
  },
  errorContainer: {
    minHeight: 20, // Fixed height to prevent shifting
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#ff6b6b',
    textAlign: 'center',
  },
});

export default SignupScreen;

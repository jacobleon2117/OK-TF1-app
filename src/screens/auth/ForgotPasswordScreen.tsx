import React, { useState, useEffect } from 'react';
import { 
  View,
  Text, 
  TextInput, 
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';
import BackgroundGrid from '../../components/BackgroundGrid';
import CircularLogo from '../../components/CircularLogo';
import LoadingScreen from '../../components/LoadingScreen';

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
  
  const { resetPassword, error, setError } = useAuth();

  // Fix for keyboard not showing up on initial load
  useEffect(() => {
    if (Platform.OS === 'ios') {
      // This timeout helps ensure the keyboard shows properly on iOS
      const timer = setTimeout(() => {
        // You could focus a specific input here if needed
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const validateForm = (): boolean => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    return true;
  };

  const handleResetPassword = async (): Promise<void> => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // Use "123456" as a default organization code for now
      await resetPassword(email, "123456");
      setEmailSent(true);
    } catch (err: any) {
      Alert.alert('Reset Password Failed', error || 'An error occurred while sending reset email');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear form data before navigation to prevent password save prompt
  const navigateToLogin = () => {
    setFullName('');
    setEmail('');
    navigation.navigate('Login');
  };

  return (
    <BackgroundGrid>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Circular Logo */}
            <CircularLogo size={80} />
            
            {/* Title and Subtitle */}
            <Text style={styles.title}>OK-TF1</Text>
            <Text style={styles.subtitle}>Urban Search and Rescue Foundation</Text>
            
            {emailSent ? (
              // Email sent success message
              <View style={styles.successContainer}>
                <Ionicons name="checkmark-circle" size={60} color="#4BB543" />
                <Text style={styles.successTitle}>Email Sent</Text>
                <Text style={styles.successMessage}>
                  We've sent a password reset link to {email}. Please check your inbox and follow the instructions to reset your password.
                </Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={navigateToLogin}
                >
                  <Text style={styles.buttonText}>Back to Login</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Reset password form
              <>
                {/* Full Name input */}
                <Text style={styles.label}>Full name</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your account name"
                    value={fullName}
                    onChangeText={(text: string) => {
                      setFullName(text);
                      setError(null);
                    }}
                    placeholderTextColor="#888"
                  />
                </View>
                
                {/* Email input */}
                <Text style={styles.label}>Email address</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your account email address"
                    value={email}
                    onChangeText={(text: string) => {
                      setEmail(text);
                      setError(null);
                    }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholderTextColor="#888"
                  />
                  <Ionicons name="mail-outline" size={20} color="#888" />
                </View>
                
                {/* Error message */}
                {error && <Text style={styles.errorText}>{error}</Text>}
                
                {/* Back to login link */}
                <View style={styles.forgotContainer}>
                  <TouchableOpacity onPress={navigateToLogin}>
                    <Text style={styles.linkText}>Back to login</Text>
                  </TouchableOpacity>
                </View>
                
                {/* Reset button */}
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleResetPassword}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Reset Password</Text>
                  )}
                </TouchableOpacity>
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
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 32,
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
  },
inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25, // Rounded corners as per Figma
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
  },
  button: {
    backgroundColor: '#F09737', // Orange accent color
    paddingVertical: 12,
    borderRadius: 25, // Rounded corners as per Figma
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  forgotContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  linkText: {
    color: 'white',
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 16,
  },
  successMessage: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  errorText: {
    color: '#ff6b6b', 
    marginBottom: 10,
    textAlign: 'center',
  }
});

export default ForgotPasswordScreen;
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity,
  Pressable,
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

type LoginScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'Login'>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const { login, error, setError } = useAuth();

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
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return false;
    }
    return true;
  };

  const handleLogin = async (): Promise<void> => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // Always use "123456" as the organization code for now
      await login(email, password, "123456");
      // If successful, the auth state will change and navigation will redirect
    } catch (err: any) {
      Alert.alert('Login Failed', error || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Clear form data before navigation to prevent password save prompt
  const navigateToForgotPassword = () => {
    setEmail('');
    setPassword('');
    navigation.navigate('ForgotPassword');
  };

  const navigateToSignup = () => {
    setEmail('');
    setPassword('');
    navigation.navigate('Signup');
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
            
            {/* Email input */}
            <Text style={styles.label}>Email address</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your email address"
                value={email}
                onChangeText={(text: string) => {
                  setEmail(text);
                  setError(null); // Clear errors when user types
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor="#888"
              />
              <Ionicons name="mail-outline" size={20} color="#888" />
            </View>
            
            {/* Password input */}
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={(text: string) => {
                  setPassword(text);
                  setError(null);
                }}
                secureTextEntry={!showPassword}
                placeholderTextColor="#888"
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#888" 
                />
              </Pressable>
            </View>
            
            {/* Forgot password link */}
            <View style={styles.forgotContainer}>
              <TouchableOpacity onPress={navigateToForgotPassword}>
                <Text style={styles.linkText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            
            {/* Error message */}
            {error && <Text style={styles.errorText}>{error}</Text>}
            
            {/* Login button */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>
            
            {/* Sign up link */}
            <View style={styles.signupContainer}>
              <Text style={styles.whiteText}>Don't have an account?</Text>
              <TouchableOpacity 
                style={styles.signupButton}
                onPress={navigateToSignup}
              >
                <Text style={styles.boldLinkText}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <LoadingScreen visible={isLoading} message="Logging in..." overlay={true} />
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
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signupButton: {
    marginLeft: 4,
  },
  linkText: {
    color: 'white',
  },
  boldLinkText: {
    color: 'white',
    fontWeight: 'bold',
  },
  whiteText: {
    color: 'white',
  },
  errorText: {
    color: '#ff6b6b',
    marginBottom: 10,
    textAlign: 'center',
  }
});

export default LoginScreen;
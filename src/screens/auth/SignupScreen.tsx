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

type SignupScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'Signup'>;
};

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [organizationCode, setOrganizationCode] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const { signup, error, setError } = useAuth();

  // Fix for keyboard not showing up on initial load
  useEffect(() => {
    if (Platform.OS === 'ios') {
      // This timeout helps ensure the keyboard shows properly on iOS
      const timer = setTimeout(() => {
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const validateForm = (): boolean => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (!organizationCode.trim()) {
      Alert.alert('Error', 'Please enter your organization code');
      return false;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter a password');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSignup = async (): Promise<void> => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await signup(name, email, password, organizationCode);
      Alert.alert('Success', 'Account created successfully!');
      // Navigation will automatically redirect based on auth state
    } catch (err: any) {
      Alert.alert('Signup Failed', error || 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear form data before navigation to prevent password save prompt
  const navigateToLogin = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setOrganizationCode('');
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
            
            {/* Full Name input */}
            <Text style={styles.label}>Full name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                value={name}
                onChangeText={(text: string) => {
                  setName(text);
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
                placeholder="Enter your email address"
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
            
            {/* Organization code */}
            <Text style={styles.label}>Organization code</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your organization code"
                value={organizationCode}
                onChangeText={(text: string) => {
                  setOrganizationCode(text.replace(/[^0-9]/g, ''));
                  setError(null);
                }}
                keyboardType="number-pad"
                maxLength={6}
                placeholderTextColor="#888"
              />
            </View>
            
            {/* Password input */}
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Create a password"
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
            
            {/* Confirm Password input */}
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={(text: string) => {
                  setConfirmPassword(text);
                  setError(null);
                }}
                secureTextEntry={!showConfirmPassword}
                placeholderTextColor="#888"
              />
              <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons 
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#888" 
                />
              </Pressable>
            </View>
            
            {/* Error message */}
            {error && <Text style={styles.errorText}>{error}</Text>}
            
            {/* Back to login link */}
            <View style={styles.forgotContainer}>
              <TouchableOpacity onPress={navigateToLogin}>
                <Text style={styles.linkText}>Back to login</Text>
              </TouchableOpacity>
            </View>
            
            {/* Signup button */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleSignup}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <LoadingScreen visible={isLoading} message="Creating account..." overlay={true} />
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
    borderRadius: 25, // rounded corners as per Figma
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
  },
  button: {
    backgroundColor: '#F09737', // orange accent color
    paddingVertical: 12,
    borderRadius: 25, // rounded corners as per Figma
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
  errorText: {
    color: '#ff6b6b',
    marginBottom: 10,
    textAlign: 'center',
  }
});

export default SignupScreen;
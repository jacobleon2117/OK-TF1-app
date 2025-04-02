// src/screens/auth/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const ForgotPasswordScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('');
  const [organizationCode, setOrganizationCode] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { resetPassword, error, setError } = useAuth();

  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (!organizationCode.trim()) {
      Alert.alert('Error', 'Please enter your organization code');
      return false;
    }
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await resetPassword(email, organizationCode);
      setEmailSent(true);
    } catch (err: any) {
      Alert.alert('Reset Password Failed', error || 'An error occurred while sending reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground 
      source={require('../../../assets/background-login.jpg')} 
      style={styles.backgroundImage}
    >
      {/* Semi-transparent overlay */}
      <View style={styles.overlay} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Title */}
            <Text style={styles.title}>OK-TF1</Text>
            
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
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={styles.buttonText}>Back to Login</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Reset password form
              <>
                <Text style={styles.subtitle}>
                  Enter your email address and organization code to reset your password.
                </Text>
                
                {/* Email input */}
                <Text style={styles.label}>Email address</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="example@gmail.com"
                    value={email}
                    onChangeText={(text) => {
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
                    placeholder="6-digit code"
                    value={organizationCode}
                    onChangeText={(text) => {
                      setOrganizationCode(text.replace(/[^0-9]/g, ''));
                      setError(null);
                    }}
                    keyboardType="number-pad"
                    maxLength={6}
                    placeholderTextColor="#888"
                  />
                  <Ionicons name="chevron-forward-outline" size={20} color="#888" />
                </View>
                
                {/* Error message */}
                {error && <Text style={styles.errorText}>{error}</Text>}
                
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
                
                {/* Back to login link */}
                <View style={styles.signupContainer}>
                  <Text style={styles.whiteText}>Remember your password?</Text>
                  <TouchableOpacity 
                    style={styles.signupButton}
                    onPress={() => navigation.navigate('Login')}
                  >
                    <Text style={styles.boldLinkText}>Log in</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
  },
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
    zIndex: 1, // Ensure content is above the overlay
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
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
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
  },
  button: {
    backgroundColor: '#5C0002', // Main red color
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signupButton: {
    marginLeft: 4,
  },
  boldLinkText: {
    color: 'white',
    fontWeight: 'bold',
  },
  whiteText: {
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
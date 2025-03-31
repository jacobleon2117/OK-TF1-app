// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity,
  Pressable,
  ImageBackground,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizationCode, setOrganizationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    console.log('Login with:', { email, password, organizationCode });
  };

  return (
    <ImageBackground 
      source={require('../../assets/background-login.jpg')} 
      style={styles.backgroundImage}
    >
      {/* Semi-transparent overlay */}
      <View style={styles.overlay} />
      
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>OK-TF1</Text>
        
        {/* Email input */}
        <Text style={styles.label}>Email address</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="example@gmail.com"
            value={email}
            onChangeText={setEmail}
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
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
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
        
        {/* Organization code */}
        <Text style={styles.label}>Organization code</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="6-digit code"
            value={organizationCode}
            onChangeText={(text) => setOrganizationCode(text.replace(/[^0-9]/g, ''))}
            keyboardType="number-pad"
            maxLength={6}
            placeholderTextColor="#888"
          />
          <Ionicons name="chevron-forward-outline" size={20} color="#888" />
        </View>
        
        {/* Login button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        
        {/* Forgot password link */}
        <View style={styles.forgotContainer}>
          <TouchableOpacity>
            <Text style={styles.linkText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
        
        {/* Sign up link */}
        <View style={styles.signupContainer}>
          <Text style={styles.whiteText}>Already have an account?</Text>
          <TouchableOpacity style={styles.signupButton}>
            <Text style={styles.boldLinkText}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
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
});

export default LoginScreen;
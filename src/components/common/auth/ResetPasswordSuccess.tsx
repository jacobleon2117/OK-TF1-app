import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AuthButton from './AuthButton';

interface ResetPasswordSuccessProps {
  email: string;
  onBackToLogin: () => void;
}

const ResetPasswordSuccess: React.FC<ResetPasswordSuccessProps> = ({ email, onBackToLogin }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="checkmark-circle" size={60} color="#4BB543" />
      <Text style={styles.title}>Email Sent</Text>
      <Text style={styles.message}>
        We've sent a password reset link to {email}. Please check your inbox and follow the
        instructions to reset your password.
      </Text>
      <AuthButton title="Back to Login" onPress={onBackToLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 16,
  },
  message: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
});

export default ResetPasswordSuccess;

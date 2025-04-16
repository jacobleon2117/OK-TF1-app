import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PasswordFieldProps extends TextInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  label = 'Password',
  value,
  onChangeText,
  placeholder = 'Enter your password',
  error,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, error ? styles.inputError : null]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPassword}
          placeholderTextColor="#888"
          autoCapitalize="none"
          {...rest}
        />
        <Pressable onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color="#888"
          />
        </Pressable>
      </View>
      <View style={styles.errorContainer}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 16,
    height: 90, // Fixed height to prevent shifting
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
    borderRadius: 25,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
  },
  errorContainer: {
    minHeight: 20, // Fixed height for error message
    justifyContent: 'center',
  },
  errorText: {
    color: '#ff6b6b',
    marginTop: 4,
  },
});

export default PasswordField;

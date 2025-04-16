import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmailFieldProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}

const EmailField: React.FC<EmailFieldProps> = ({ value, onChangeText, error, ...rest }) => {
  return (
    <View>
      <Text style={styles.label}>Email address</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your email address"
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="#888"
          {...rest}
        />
        <Ionicons name="mail-outline" size={20} color="#888" />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
  },
  errorText: {
    color: '#ff6b6b',
    marginBottom: 8,
  },
});

export default EmailField;

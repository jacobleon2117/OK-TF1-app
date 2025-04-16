import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';

interface FullNameFieldProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}

const FullNameField: React.FC<FullNameFieldProps> = ({ value, onChangeText, error, ...rest }) => {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>Full name</Text>
      <View style={[styles.inputContainer, error ? styles.inputError : null]}>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="#888"
          {...rest}
        />
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

export default FullNameField;

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface FullNameFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}

const FullNameField: React.FC<FullNameFieldProps> = ({ value, onChangeText, error }) => {
  return (
    <View>
      <Text style={styles.label}>Full name</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="#888"
        />
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

export default FullNameField;

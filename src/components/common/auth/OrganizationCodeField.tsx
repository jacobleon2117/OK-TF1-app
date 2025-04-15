import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface OrganizationCodeFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}

const OrganizationCodeField: React.FC<OrganizationCodeFieldProps> = ({
  value,
  onChangeText,
  error,
}) => {
  const handleTextChange = (text: string) => {
    const digitsOnly = text.replace(/[^0-9]/g, '');
    onChangeText(digitsOnly);
  };

  return (
    <View>
      <Text style={styles.label}>Organization code</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your organization code"
          value={value}
          onChangeText={handleTextChange}
          keyboardType="number-pad"
          maxLength={6}
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

export default OrganizationCodeField;

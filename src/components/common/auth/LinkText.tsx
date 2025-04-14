import React from 'react';
import { Text, TouchableOpacity, StyleSheet, TextStyle, StyleProp } from 'react-native';

interface LinkTextProps {
  text: string;
  onPress: () => void;
  style?: StyleProp<TextStyle>;
  bold?: boolean;
}

const LinkText: React.FC<LinkTextProps> = ({ text, onPress, style, bold = false }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={[styles.link, bold && styles.bold, style]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  link: {
    color: 'white',
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default LinkText;

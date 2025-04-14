import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CircularLogo from './CircularLogo';

interface AuthHeaderProps {
  title?: string;
  subtitle?: string;
  logoSize?: number;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({
  title = 'OK-TF1',
  subtitle = 'Urban Search and Rescue Foundation',
  logoSize = 80,
}) => {
  return (
    <View style={styles.container}>
      <CircularLogo size={logoSize} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 32,
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
  },
});

export default AuthHeader;

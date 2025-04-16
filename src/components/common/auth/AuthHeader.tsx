import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AuthHeaderProps {
  title?: string;
  subtitle?: string;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({
  title = 'TaskCom',
  subtitle = 'Team Communication Platform',
}) => {
  return (
    <View style={styles.container}>
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
    fontSize: 40,
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

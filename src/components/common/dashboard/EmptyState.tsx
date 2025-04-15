import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

type FontAwesomeIconName =
  | 'file-text-o'
  | 'envelope-o'
  | 'calendar-o'
  | 'map-o'
  | 'user-o'
  | 'exclamation-circle';

interface EmptyStateProps {
  icon: FontAwesomeIconName;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, message }) => {
  return (
    <View style={styles.emptyStateContainer}>
      <FontAwesome name={icon} size={48} color="#333" />
      <Text style={styles.emptyStateText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyStateContainer: {
    flex: 1,
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#666',
    fontSize: 16,
    marginTop: 16,
  },
});

export default EmptyState;

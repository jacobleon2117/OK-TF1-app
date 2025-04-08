// src/components/cards/StatusCard.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CardContainer from './CardContainer';

interface StatusCard {
  onPress?: () => void;
}

export default function StatusCard({ onPress}: StatusCardProps) {
  return (
    <CardContainer 
      style={styles.container}
      title="Status" 
      icon={<Ionicons 
        name="notifications" 
        size={25} 
        color="#9b59b6" />}
      onPress={onPress}  
    >
      <View style={styles.content}>
        <Text style={styles.text}>
          Connect to ...
        </Text>
      </View>
    </CardContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: '#fff'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },

});

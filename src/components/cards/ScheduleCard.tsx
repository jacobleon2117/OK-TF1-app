// src/components/cards/ScheduleCard.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CardContainer from './CardContainer';
import NavigationService from '../../services/NavigationService';

export default function ScheduleCard() { 
  const handlePress = () => {
    NavigationService.handleScheduleCardPress();
  };
  
  return (
    <CardContainer
      style={styles.container} 
      title="Schedule" 
      icon={<Ionicons 
        name="calendar-clear-outline" 
        size={25} color="#4da6ff" />}
      onPress={handlePress} // Changed from onPress to handlePress
    >
      <View style={styles.content}>
        <Text style={styles.text}>
          connect to Schedule
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
    color: '#fff', //If you want white text on your dark card
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
});

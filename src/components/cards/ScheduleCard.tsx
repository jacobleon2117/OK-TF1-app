// src/components/cards/ScheduleCard.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CardContainer from './CardContainer';

interface ScheduleCardProps {
  onPress?: () => void;
}

export default function ScheduleCard({ onPress }: ScheduleCardProps) {  
   return (
    <CardContainer
      style={styles.container} 
      title="Schedule" 
      icon={<Ionicons 
        name="calendar-clear-outline" 
        size={25} color="#4da6ff" />}
      onPress={onPress} // Pass the onPress prop here
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
    color: '#fff', // Assuming you want white text on your dark card
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
});

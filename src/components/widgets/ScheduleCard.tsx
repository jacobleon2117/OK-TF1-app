// src/components/widgets/ScheduleCard.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CardContainer from './CardContainer';

export default function ScheduleCard() {
  // Demo data
  
    
   return (
    <CardContainer
      style ={styles.container} 
      title="Schedule" 
      icon={<Ionicons 
      name="calendar-clear-outline" 
      size={25} color="#4da6ff"  />}
    >
      <View style= '{style:mapPreview}'>
              <Text>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
    
});

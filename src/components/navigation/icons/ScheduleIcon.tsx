import React from 'react';
import { View, Text, StyleSheet } from 'react-native'; 
import { Ionicons } from '@expo/vector-icons';

const ScheduleIcon = ({ active, size = 24, showLabel = true }) => ( 
  <View style={styles.tab}>
    <Ionicons 
              name={active ? 'calendar-clear' : 'calendar-clear-outline'} 
              size={size} 
              color={active ? '#F7941D' : '#0047AB'} 
            />
            {showLabel && (
            <Text 
              style={[styles.tabText, active && styles.activeTabText]}
            >
              Schedule
            </Text>
     )}
  </View>
);

const styles = StyleSheet.create({
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  active: {
    borderTopWidth: 2,
    borderTopColor: '#F7941D'
  },
  tabText: {
    fontSize: 10,
    marginTop: 2,
    color: '#0047AB'
  },
  activeTabText: {
    color: '#F7941D',
    fontWeight: 'normal'
  }
}); 

export default ScheduleIcon;

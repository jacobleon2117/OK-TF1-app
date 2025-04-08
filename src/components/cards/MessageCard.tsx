// src/components/cards/MessageCard.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CardContainer from './CardContainer';
import NavigationService from '../../services/NavigationService';

export default function MessageCard() {
  const handlePress = () => {
    NavigationService.handleMessageCardPress();
  };

  return (
    <CardContainer 
      style={styles.container} // Added container style here
      title="Messages" 
      icon={<Ionicons 
        name="chatbox-outline" 
        size={24} color="#4cd964" />}
      onPress={handlePress}
    >
      <View style={styles.content}>
        <Text style={styles.text}>
          connect to messages
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
    color: '#fff',
  },
});

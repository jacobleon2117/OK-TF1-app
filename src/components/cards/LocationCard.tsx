// src/components/cards/LocationCard.tsx
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CardContainer from './CardContainer';

interface LocationCardProps {
  onPress?: () => void;
}

export default function LocationCard({ onPress }: LocationCardProps) {
  return (
    <CardContainer
      style={styles.container}
      title=""
      icon={
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground} />
          <Ionicons 
            name="walk-outline" 
            size={64} //icon height controlled by style:walkIcon
            color="#fff" 
            style={styles.walkIcon} 
          />
        </View>
      }
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
    flex: 1
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  
  iconContainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginRight: 6,
  },
  iconBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: 'rgba(247, 148, 29, 0.7)', // F7941D with alpha 0.7
    borderWidth: 4,
    borderColor: '#D47A0A', // Darker orange border
  },
  walkIcon: {
    zIndex: 1,
    fontSize: 24,  //controls walker icon height
  },
  emptyContent: {
    flex: 1,
  }
});

// src/components/widgets/StatusWidget.tsx
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CardContainer from './CardContainer';

export default function StatusWidget() {
  return (
    <CardContainer
      title=""
      icon={
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground} />
          <Ionicons 
            name="walk-outline" 
            size={64} 
            color="#fff" 
            style={styles.walkIcon} 
          />
        </View>
      }
    >
      {/* Empty content or you can add other content here */}
      <View style={styles.emptyContent} />
    </CardContainer>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    height: 40,
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
    fontSize: 24,
  },
  emptyContent: {
    flex: 1,
  }
});

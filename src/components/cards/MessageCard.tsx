// src/components/cards/MessageCard.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CardContainer from './CardContainer';

export default function MessageCard({ onPress }: { onPress?: () => void }) {
  // Demo data
  const data = {
  }

  return (
    <CardContainer 
      title="Messages" 
      icon={<Ionicons 
        name="chatbox-outline" 
        size={24} color="#4cd964" />}
      onPress={onPress}
    >
      <View style= '{style:mapPreview}'>
        <Text>
        connect to messages
        </Text>
      </View>
    </CardContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  mapPreview: {
    width: 80,
    aspectRatio: 1,
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
    marginRight: 8,
    alignSelf: 'stretch', 
  },
  mapPlaceholder: {
    backgroundColor: '#1c1c1e',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridLines: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
    currentLocation: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4cd964',
    borderWidth: 2,
    borderColor: '#fff',
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
    padding: 2,
  },
  expandIcon: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
    padding: 2,
  },
  notMap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  locationColumn: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  locationInfo: {
    flexDirection: 'column',
    alignItems: 'right',
    marginLeft: 4,
    marginBottom: 4,
  },
  locationIcon: {
    marginRight: 4,
  },
  locationText: {
    color: '#fff',
    fontSize: 12,
  },
  coordinatesContainer: {
    marginBottom: 4,
  },
  coordinatesText: {
    color: '#aaa',
    fontSize: 10,
    fontFamily: 'monospace', 
  },
  statsColumn: {
    // justifyContent: 'space-between',
    marginTop: 2,
  },
  statText: {
    color: '#ccc',
    fontSize: 10,
  },
});

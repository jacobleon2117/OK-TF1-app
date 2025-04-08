// src/components/widgets/CardContainer.tsx
import React, { ReactNode } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CardContainerProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  onPress?: () => void;
  hideChevron?: boolean; // New prop to optionally hide chevron
  style?: object; //allows custom styling
}

export default function CardContainer({
  title,
  icon,
  children,
  onPress,
  hideChevron = false, // Default to showing chevron
  style = {} // Default empty style object
}: CardContainerProps) {
  const Container = onPress ? TouchableOpacity : View;
  
  return (
    <Container 
      style={[styles.container, style]} // Merge default and custom styles
      onPress={onPress}
      activeOpacity={onPress ? 0.4 : 1}
    >
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={styles.title}>{title}</Text>
          </View>
          {!hideChevron && ( // Always show chevron unless explicitly hidden
            <Ionicons name="chevron-forward" size={14} color="#aaa" />
          )}
        </View>
        <View style={styles.childrenContainer}>
          {children}
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: '#333333', // Dark gray that contrasts with black
    // Removed fixed height of 140px to allow container to expand
    flex: 1, // Added flex: 1 to allow container to fill available space
    
  },
  content: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  childrenContainer: {
    padding: 12,
    flex: 1,
  },
});

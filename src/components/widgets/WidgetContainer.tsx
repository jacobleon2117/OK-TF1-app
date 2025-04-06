// src/components/widgets/WidgetContainer.tsx
import React, { ReactNode } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WidgetContainerProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  onPress?: () => void;
}

export default function WidgetContainer({
  title,
  icon,
  children,
  onPress
}: WidgetContainerProps) {
  const Container = onPress ? TouchableOpacity : View;
  
  return (
    <Container 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={styles.title}>{title}</Text>
          </View>
          {onPress && (
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
    height: 140, // More compact height
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
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',
  },
  childrenContainer: {
    padding: 8,
    flex: 1,
  },
});

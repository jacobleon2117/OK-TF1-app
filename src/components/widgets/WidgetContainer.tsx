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
      activeOpacity={onPress ? 0.8 : 1}
    >
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={styles.title}>{title}</Text>
          </View>
          {onPress && (
            <Ionicons name="chevron-forward" size={18} color="#777" />
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
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  content: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
  childrenContainer: {
    padding: 16,
  },
});

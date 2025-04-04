// src/components/widgets/StatusWidget.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WidgetContainer from './WidgetContainer';

export default function StatusWidget() {
  // Demo status data
  const statusData = {
    system: 'online',
    components: [
      { name: 'Station 01', status: 'online' },
      { name: 'Station 02', status: 'online' },
      { name: 'Command', status: 'warning' },
    ]
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online':
        return { name: 'checkmark-circle', color: '#2ecc71' };
      case 'offline':
        return { name: 'close-circle', color: '#e74c3c' };
      case 'warning':
        return { name: 'warning', color: '#f39c12' };
      default:
        return { name: 'help-circle', color: '#95a5a6' };
    }
  };

  const mainStatus = getStatusIcon(statusData.system);

  return (
    <WidgetContainer 
      title="System Status" 
      icon={<Ionicons name="pulse" size={14} color="#2ecc71" />}
    >
      <View style={styles.statusContent}>
        <View style={styles.topSection}>
          <View style={styles.mainStatus}>
            <Ionicons 
              name={mainStatus.name as any} 
              size={18} 
              color={mainStatus.color}
              style={styles.statusIcon} 
            />
            <Text style={styles.statusText}>All Stations Operational</Text>
          </View>
        </View>
        
        <View style={styles.componentList}>
          {statusData.components.map((component, index) => {
            const { name, color } = getStatusIcon(component.status);
            return (
              <View key={index} style={styles.componentItem}>
                <Ionicons name={name as any} size={12} color={color} />
                <Text style={styles.componentName}>{component.name}</Text>
                <Text style={[styles.componentStatus, { color }]}>
                  {component.status.toUpperCase()}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </WidgetContainer>
  );
}

const styles = StyleSheet.create({
  statusContent: {
    flex: 1,
  },
  topSection: {
    marginBottom: 4,
  },
  mainStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  componentList: {
    flex: 1,
  },
  componentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  componentName: {
    flex: 1,
    marginLeft: 6,
    fontSize: 11,
    color: '#ccc',
  },
  componentStatus: {
    fontSize: 10,
    fontWeight: '500',
  },
});

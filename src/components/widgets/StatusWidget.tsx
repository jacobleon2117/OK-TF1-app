// src/components/widgets/StatusWidget.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WidgetContainer from './WidgetContainer';

// Placeholder imports for future implementation
// import { fetchSystemStatus } from '../../services/statusService';
// import { useRefreshInterval } from '../../hooks/useRefreshInterval';

export default function StatusWidget() {
  // Demo status data - will be replaced with real data
  const statusData = {
    system: 'online',
    lastUpdated: new Date(),
    components: [
      { name: 'Station 01', status: 'online' },
      { name: 'Station 02', status: 'online' },
      { name: 'Command Center', status: 'warning' },
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
  const formattedTime = statusData.lastUpdated.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const handlePress = () => {
    // Handle widget press - can be used to open detailed status view
    console.log('Status widget pressed');
  };

  return (
    <WidgetContainer 
      title="System Status" 
      icon={<Ionicons name="pulse" size={18} color="#2ecc71" />}
      onPress={handlePress}
    >
      <View style={styles.statusContent}>
        <View style={styles.mainStatus}>
          <Ionicons 
            name={mainStatus.name as any} 
            size={28} 
            color={mainStatus.color} 
            style={styles.statusIcon} 
          />
          <View>
            <Text style={styles.statusText}>All Stations Operational</Text>
            <Text style={styles.lastUpdated}>Updated at {formattedTime}</Text>
          </View>
        </View>
        
        <View style={styles.componentList}>
          {statusData.components.map((component, index) => {
            const { name, color } = getStatusIcon(component.status);
            return (
              <View key={index} style={styles.componentItem}>
                <View style={styles.componentIconContainer}>
                  <Ionicons name={name as any} size={14} color={color} />
                </View>
                <Text style={styles.componentName}>{component.name}</Text>
                <Text style={[styles.componentStatus, { color }]}>
                  {component.status.charAt(0).toUpperCase() + component.status.slice(1)}
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
    marginTop: 4,
  },
  mainStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIcon: {
    marginRight: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  componentList: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 12,
  },
  componentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  componentIconContainer: {
    width: 24,
    alignItems: 'center',
  },
  componentName: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: '#333',
  },
  componentStatus: {
    fontSize: 13,
    fontWeight: '500',
  },
});

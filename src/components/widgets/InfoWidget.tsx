// src/components/widgets/InfoWidget.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CardContainer from './CardContainer';

export default function InfoWidget() {
  // Demo notification data
  const notifications = [
    { 
      id: 1, 
      type: 'alert', 
      message: 'Emergency drill at 2PM today', 
      time: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
    },
    { 
      id: 2, 
      type: 'info', 
      message: 'New schedule posted for next week', 
      time: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'alert':
        return { name: 'alert-circle', color: '#e74c3c' };
      case 'warning':
        return { name: 'warning', color: '#f39c12' };
      case 'info':
        return { name: 'information-circle', color: '#3498db' };
      case 'success':
        return { name: 'checkmark-circle', color: '#2ecc71' };
      default:
        return { name: 'notifications', color: '#7f8c8d' };
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval}y`;
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval}mo`;
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval}d`;
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval}h`;
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval}m`;
    
    return 'now';
  };

  return (
    <CardContainer 
      title="Notifications" 
      icon={<Ionicons name="notifications" size={14} color="#9b59b6" />}
    >
      <View style={styles.infoContent}>
        {notifications.length > 0 ? (
          <View style={styles.notificationList}>
            {notifications.map((notification) => {
              const { name, color } = getNotificationIcon(notification.type);
              return (
                <View key={notification.id} style={styles.notificationItem}>
                  <Ionicons name={name as any} size={14} color={color} style={styles.notificationIcon} />
                  <View style={styles.messageContainer}>
                    <Text 
                      style={styles.notificationMessage} 
                      numberOfLines={1}
                    >
                      {notification.message}
                    </Text>
                    <Text style={styles.notificationTime}>
                      {formatTimeAgo(notification.time)} ago
                    </Text>
                  </View>
                </View>
              );
            })}
            
            {notifications.length > 2 && (
              <Text style={styles.moreText}>+{notifications.length - 2} more</Text>
            )}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-circle" size={20} color="#aaa" />
            <Text style={styles.emptyText}>No notifications</Text>
          </View>
        )}
      </View>
    </CardContainer>
  );
}

const styles = StyleSheet.create({
  infoContent: {
    flex: 1,
    justifyContent: 'center',
  },
  notificationList: {
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  notificationIcon: {
    marginRight: 8,
  },
  messageContainer: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 12,
    color: '#fff',
  },
  notificationTime: {
    fontSize: 10,
    color: '#aaa',
  },
  moreText: {
    fontSize: 10,
    color: '#9b59b6',
    fontStyle: 'italic',
    marginTop: 2,
    textAlign: 'right',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#aaa',
    marginTop: 2,
    fontSize: 11,
  },
});

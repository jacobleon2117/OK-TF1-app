// src/components/widgets/InfoWidget.tsx
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WidgetContainer from './WidgetContainer';

// Placeholder imports for future implementation
// import { fetchNotifications } from '../../services/notificationService';
// import { useUserContext } from '../../contexts/UserContext';

export default function InfoWidget() {
  // Demo notification data - will be replaced with real data
  const notifications = [
    { 
      id: 1, 
      type: 'alert', 
      message: 'Emergency drill at 2PM today', 
      time: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
      read: false
    },
    { 
      id: 2, 
      type: 'info', 
      message: 'New schedule posted for next week', 
      time: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      read: true
    },
    { 
      id: 3, 
      type: 'success', 
      message: 'Equipment check completed',
      time: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true
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
    if (interval >= 1) return `${interval}y ago`;
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval}mo ago`;
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval}d ago`;
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval}h ago`;
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval}m ago`;
    
    return 'Just now';
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handlePress = () => {
    // Handle widget press - can be used to open notifications
    console.log('Info widget pressed');
  };

  return (
    <WidgetContainer 
      title="Notifications" 
      icon={<Ionicons name="notifications" size={18} color="#9b59b6" />}
      onPress={handlePress}
    >
      <View style={styles.infoContent}>
        {unreadCount > 0 && (
          <View style={styles.unreadBanner}>
            <Text style={styles.unreadText}>{unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}</Text>
          </View>
        )}
        
        <View style={styles.notificationList}>
          {notifications.length > 0 ? (
            notifications.slice(0, 2).map((notification) => {
              const { name, color } = getNotificationIcon(notification.type);
              return (
                <View 
                  key={notification.id} 
                  style={[
                    styles.notificationItem,
                    notification.read ? styles.readItem : styles.unreadItem
                  ]}
                >
                  <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                    <Ionicons name={name as any} size={14} color={color} />
                  </View>
                  <View style={styles.messageContainer}>
                    <Text 
                      style={[
                        styles.notificationMessage,
                        notification.read ? styles.readText : styles.unreadText
                      ]}
                      numberOfLines={1}
                    >
                      {notification.message}
                    </Text>
                    <Text style={styles.notificationTime}>
                      {formatTimeAgo(notification.time)}
                    </Text>
                  </View>
                  {!notification.read && (
                    <View style={styles.unreadDot} />
                  )}
                </View>
              );
            })
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="checkmark-circle" size={24} color="#bbb" />
              <Text style={styles.emptyText}>No notifications</Text>
            </View>
          )}
        </View>
        
        {notifications.length > 2 && (
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All {notifications.length} Notifications</Text>
            <Ionicons name="chevron-forward" size={12} color="#9b59b6" />
          </TouchableOpacity>
        )}
      </View>
    </WidgetContainer>
  );
}

const styles = StyleSheet.create({
  infoContent: {
    marginTop: 4,
  },
  unreadBanner: {
    backgroundColor: '#9b59b620',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  unreadText: {
    fontWeight: '600',
    color: '#9b59b6',
  },
  notificationList: {
    marginBottom: 8,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  readItem: {
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  unreadItem: {
    borderBottomColor: 'rgba(0,0,0,0.1)',
    backgroundColor: 'rgba(245,245,245,0.6)',
  },
  iconContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  messageContainer: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 13,
    marginBottom: 2,
  },
  readText: {
    color: '#666',
    fontWeight: 'normal',
  },
  notificationTime: {
    fontSize: 11,
    color: '#999',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9b59b6',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    color: '#bbb',
    marginTop: 8,
    fontSize: 14,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  viewAllText: {
    color: '#9b59b6',
    fontSize: 13,
    fontWeight: '500',
    marginRight: 4,
  },
});

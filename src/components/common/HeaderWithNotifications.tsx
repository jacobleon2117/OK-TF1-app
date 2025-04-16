import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NotificationsModal from './NotificationsModal';

interface HeaderWithNotificationsProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}

const HeaderWithNotifications: React.FC<HeaderWithNotificationsProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  rightComponent,
}) => {
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  return (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.leftSection}>
          {showBackButton && (
            <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>{title}</Text>
        </View>

        <View style={styles.rightSection}>
          {rightComponent}
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => setNotificationsVisible(true)}
          >
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <NotificationsModal
        visible={notificationsVisible}
        onClose={() => setNotificationsVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 60,
    marginTop: 50,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  notificationButton: {
    padding: 4,
  },
});

export default HeaderWithNotifications;

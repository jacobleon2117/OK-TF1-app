import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Header = ({ username, onNotificationsPress, onMenuPress, onProfilePress }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.profileTab} onPress={onProfilePress}>
        <Ionicons name="person-circle-outline" size={24} color="#333" />
        <Text style={styles.tabText}>{username || 'Guest'}</Text>
      </TouchableOpacity>
      
      <View style={styles.rightTabs}>
        <TouchableOpacity style={styles.tab} onPress={onNotificationsPress}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
          <Text style={styles.smallTabText}>Alerts</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tab} onPress={onMenuPress}>
          <Ionicons name="menu-outline" size={24} color="#333" />
          <Text style={styles.smallTabText}>Menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingVertical: 5,
  },
  profileTab: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  rightTabs: {
    flexDirection: 'row',
  },
  tab: {
    alignItems: 'center',
    padding: 10,
    minWidth: 60,
  },
  tabText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  smallTabText: {
    fontSize: 12,
    marginTop: 2,
  }
});

export default Header;

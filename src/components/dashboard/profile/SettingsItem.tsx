import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesomeIconName } from '@/screens/dashboard/Profile/profileUtils/settingsUtils';

interface SettingsItemProps {
  icon: FontAwesomeIconName;
  title: string;
  onPress: () => void;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ icon, title, onPress }) => {
  return (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <FontAwesome name={icon} size={20} color="#fff" style={styles.settingIcon} />
      <Text style={styles.settingText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0,
  },
  settingIcon: {
    width: 24,
    marginRight: 16,
  },
  settingText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SettingsItem;

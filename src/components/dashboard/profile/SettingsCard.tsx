import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SettingsItem from './SettingsItem';
import { SettingItem } from '@/screens/dashboard/Profile/profileUtils/settingsUtils';

interface SettingsCardProps {
  title: string;
  items: SettingItem[];
  onItemPress: (id: string) => void;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ title, items, onItemPress }) => {
  return (
    <View style={styles.settingsCard}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {items.map(item => (
        <SettingsItem
          key={item.id}
          icon={item.icon}
          title={item.title}
          onPress={() => onItemPress(item.id)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  settingsCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default SettingsCard;

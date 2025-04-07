//HomeIcon.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { iconStyle } from './IconStyle';

interface HomeIconProps {
  active: boolean;
  size?: number;
  showLabel?: boolean;
  activeColor?: string;
  inactiveColor?: string;
  label?: string;
}

const HomeIcon = ({
  active,
  size = iconStyle.sizes.default,
  showLabel = iconStyle.showLabel,
  activeColor = iconStyle.active,
  inactiveColor = iconStyle.inactive,
  label = "Home"
}: HomeIconProps) => (

  <View style={styles.tab}>
    <Ionicons
      name={active ? 'home' : 'home-outline'}
      size={size}
      color={active ? activeColor : inactiveColor}
    />
    {showLabel && (
      <Text
        style={[
          styles.tabText,
          active && styles.activeTabText,
          { 
            color: active ? activeColor : inactiveColor 
          }
        ]}
      >
        {label}
      </Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: iconStyle.active
  },
  tabText: {
    fontSize: iconStyle.fontSizes.label,
    marginTop: 2,
    color: iconStyle.inactive
  },
  activeTabText: {
    color: iconStyle.active,
    fontWeight: 'bold'
  }
});

export default HomeIcon;

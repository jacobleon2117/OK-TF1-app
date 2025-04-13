import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

type FontAwesomeIconName = 'home' | 'calendar' | 'comments' | 'map' | 'file-text-o' | 'user';

export type NavItem = {
  name: string;
  icon: FontAwesomeIconName;
  screen: string;
};

interface BottomNavigationProps {
  navigation: any;
  currentScreen: string;
  items: NavItem[];
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  navigation,
  currentScreen,
  items,
}) => {
  return (
    <View style={styles.bottomNavContainer}>
      <View style={styles.bottomNav}>
        {items.map(item => (
          <TouchableOpacity
            key={item.screen}
            style={styles.navItem}
            onPress={() => item.screen !== currentScreen && navigation.navigate(item.screen)}
          >
            <FontAwesome
              name={item.icon}
              size={24}
              color={currentScreen === item.screen ? '#FF8C00' : '#fff'}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNavContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  bottomNav: {
    height: 60,
    flexDirection: 'row',
    backgroundColor: '#111',
    borderRadius: 30,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BottomNavigation;

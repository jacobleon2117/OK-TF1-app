import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from '@/types/navigation';

interface FloatingBottomNavProps {
  currentScreen: 'Home' | 'Calendar' | 'Messages' | 'Map' | 'MissionReports' | 'Profile';
}

const FloatingBottomNav: React.FC<FloatingBottomNavProps> = ({ currentScreen }) => {
  const navigation = useNavigation<RootNavigationProp>();

  return (
    <View style={styles.bottomNavContainer}>
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => currentScreen !== 'Home' && navigation.navigate('Home')}
        >
          <FontAwesome
            name="home"
            size={24}
            color={currentScreen === 'Home' ? '#FF8C00' : '#fff'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => currentScreen !== 'Calendar' && navigation.navigate('Calendar')}
        >
          <FontAwesome
            name="calendar"
            size={24}
            color={currentScreen === 'Calendar' ? '#FF8C00' : '#fff'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => currentScreen !== 'Messages' && navigation.navigate('Messages')}
        >
          <FontAwesome
            name="comments"
            size={24}
            color={currentScreen === 'Messages' ? '#FF8C00' : '#fff'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => currentScreen !== 'Map' && navigation.navigate('Map')}
        >
          <FontAwesome name="map" size={24} color={currentScreen === 'Map' ? '#FF8C00' : '#fff'} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() =>
            currentScreen !== 'MissionReports' && navigation.navigate('MissionReports')
          }
        >
          <FontAwesome
            name="file-text-o"
            size={24}
            color={currentScreen === 'MissionReports' ? '#FF8C00' : '#fff'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => currentScreen !== 'Profile' && navigation.navigate('Profile')}
        >
          <FontAwesome
            name="user"
            size={24}
            color={currentScreen === 'Profile' ? '#FF8C00' : '#fff'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNavContainer: {
    position: 'absolute',
    bottom: 50,
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

export default FloatingBottomNav;

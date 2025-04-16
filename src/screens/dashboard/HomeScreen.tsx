import React from 'react';
import { StyleSheet, View, Text, StatusBar, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation';
import { BottomNavigation } from '@/components/common/dashboard';
import { DASHBOARD_NAV_ITEMS } from '@/constants/navigation';
import { useAuth } from '@/context/AuthContext';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { userData } = useAuth();
  const firstName = userData?.displayName?.split(' ')[0] || 'User';

  const handleNotificationPress = () => {
    // Navigate to notifications screen or show notifications overlay
    navigation.navigate('Notifications');
  };

  const navigateToMessages = () => {
    navigation.navigate('Messages');
  };

  const navigateToShifts = () => {
    navigation.navigate('Calendar');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Top Navigation Bar */}
      <View style={styles.topNav}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{firstName}</Text>
        </View>
        <TouchableOpacity onPress={handleNotificationPress} style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Recent Messages Card */}
        <TouchableOpacity style={styles.card} onPress={navigateToMessages}>
          <View style={styles.cardHeader}>
            <FontAwesome name="comments" size={22} color="white" />
            <Text style={styles.cardTitle}>Recent Messages</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="white" style={styles.cardArrow} />
        </TouchableOpacity>

        {/* Upcoming Shifts Card */}
        <TouchableOpacity style={styles.card} onPress={navigateToShifts}>
          <View style={styles.cardHeader}>
            <FontAwesome name="clock-o" size={22} color="white" />
            <Text style={styles.cardTitle}>Upcoming Shifts</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="white" style={styles.cardArrow} />
        </TouchableOpacity>

        {/* Quick Action Buttons */}
        <View style={styles.quickActionContainer}>
          <TouchableOpacity style={styles.quickActionButton}>
            <View style={[styles.iconCircle, { backgroundColor: '#8B5A2B' }]}>
              <FontAwesome name="user" size={24} color="white" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <View style={[styles.iconCircle, { backgroundColor: '#1E5C97' }]}>
              <FontAwesome name="bar-chart" size={24} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <FontAwesome name="home" size={24} color="#FF8C00" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Calendar')}>
            <FontAwesome name="calendar" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Messages')}>
            <FontAwesome name="comments" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Map')}>
            <FontAwesome name="map" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('MissionReports')}
          >
            <FontAwesome name="file-text-o" size={22} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
            <FontAwesome name="user" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 40,
  },
  welcomeText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  notificationButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
  cardArrow: {
    opacity: 0.7,
  },
  quickActionContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  quickActionButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    height: 120,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
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

export default HomeScreen;

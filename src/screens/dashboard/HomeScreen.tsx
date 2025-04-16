import React from 'react';
import { StyleSheet, View, Text, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation';
import { useAuth } from '../../context/AuthContext';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { BottomNavigation } from '@/components/common/dashboard';
import { DASHBOARD_NAV_ITEMS } from '@/constants/navigation';

const { width } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { userData } = useAuth();
  const firstName = userData?.displayName?.split(' ')[0] || 'User';

  const handleNotificationPress = () => {
    // Navigate to notifications screen or show notifications overlay
    // navigation.navigate('Notifications');
  };

  const navigateToMessages = () => {
    navigation.navigate('Messages');
  };

  const navigateToShifts = () => {
    navigation.navigate('Calendar');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Welcome Header */}
      <View style={styles.welcomeHeader}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{firstName}</Text>
        </View>
        <TouchableOpacity onPress={handleNotificationPress}>
          <Ionicons name="notifications-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.cardsContainer}>
        {/* Recent Messages Card */}
        <TouchableOpacity style={styles.messageCard} onPress={navigateToMessages}>
          <View style={styles.cardContent}>
            <View style={styles.iconTextRow}>
              <FontAwesome name="comments" size={22} color="white" />
              <Text style={styles.cardTitle}>Recent Messages</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </View>
        </TouchableOpacity>

        {/* Upcoming Shifts Card */}
        <TouchableOpacity style={styles.shiftsCard} onPress={navigateToShifts}>
          <View style={styles.cardContent}>
            <View style={styles.iconTextRow}>
              <FontAwesome name="clock-o" size={22} color="white" />
              <Text style={styles.cardTitle}>Upcoming Shifts</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </View>
        </TouchableOpacity>

        {/* Quick Action Buttons */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.iconCircle, { backgroundColor: '#8B5A2B' }]}>
              <FontAwesome name="user" size={24} color="white" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.iconCircle, { backgroundColor: '#1E5C97' }]}>
              <FontAwesome name="bar-chart" size={24} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation */}
      <BottomNavigation navigation={navigation} currentScreen="Home" items={DASHBOARD_NAV_ITEMS} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 50,
    marginBottom: 15,
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
  cardsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 80, // Space for bottom navigation
  },
  messageCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    height: 70,
  },
  shiftsCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    height: 180,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  actionButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    width: '48%',
    aspectRatio: 1, // Perfect square
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
});

export default HomeScreen;

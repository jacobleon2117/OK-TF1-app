// src/screens/dashboard/HomeScreen.tsx
import React from 'react';
import { StyleSheet, View, Text, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation';
import { useAuth } from '@/context/AuthContext';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { BottomNavigation } from '@/components/common/dashboard';
import { DASHBOARD_NAV_ITEMS } from '@/constants/navigation';

const { height } = Dimensions.get('window');
const BOTTOM_NAV_HEIGHT = 80;
const HEADER_HEIGHT = 100;
const AVAILABLE_SPACE = height - BOTTOM_NAV_HEIGHT - HEADER_HEIGHT;

type NavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { userData } = useAuth();
  const firstName = userData?.displayName?.split(' ')[0] || 'User';

  const handleNotificationPress = () => {
    // Navigate to notifications screen or show notifications overlay
  };

  const navigateToMessages = () => {
    navigation.navigate('Messages');
  };

  const navigateToShifts = () => {
    navigation.navigate('Calendar');
  };

  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  const navigateToMissionReports = () => {
    navigation.navigate('MissionReports');
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
        {/* Card 1: Recent Messages Card */}
        <TouchableOpacity style={styles.messageCard} onPress={navigateToMessages}>
          <View style={styles.cardContent}>
            <View style={styles.iconTextRow}>
              <FontAwesome name="comments" size={24} color="white" />
              <Text style={styles.cardTitle}>Recent Messages</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </View>
          <View style={styles.messagePreview}>
            <Text style={styles.previewText}>No new messages</Text>
          </View>
        </TouchableOpacity>

        {/* Card 2: Upcoming Shifts Card */}
        <TouchableOpacity style={styles.shiftsCard} onPress={navigateToShifts}>
          <View style={styles.cardContent}>
            <View style={styles.iconTextRow}>
              <FontAwesome name="calendar" size={24} color="white" />
              <Text style={styles.cardTitle}>Upcoming Shifts</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </View>
          <View style={styles.shiftsContentPlaceholder}>
            <Text style={styles.emptyShiftText}>No upcoming shifts scheduled</Text>
          </View>
        </TouchableOpacity>

        {/* Cards 3 & 4: Action Buttons Row */}
        <View style={styles.actionButtonsRow}>
          {/* Card 3: Profile Button */}
          <TouchableOpacity style={styles.actionButton} onPress={navigateToProfile}>
            <View style={[styles.iconCircle, { backgroundColor: '#8B5A2B' }]}>
              <FontAwesome name="user" size={28} color="white" />
            </View>
            <Text style={styles.actionButtonText}>My Profile</Text>
          </TouchableOpacity>

          {/* Card 4: Mission Reports Button */}
          <TouchableOpacity style={styles.actionButton} onPress={navigateToMissionReports}>
            <View style={[styles.iconCircle, { backgroundColor: '#1E5C97' }]}>
              <FontAwesome name="file-text-o" size={28} color="white" />
            </View>
            <Text style={styles.actionButtonText}>Mission Reports</Text>
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
    height: HEADER_HEIGHT - 50, // Adjust based on the marginTop
  },
  welcomeText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  cardsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20, // Add some space at the bottom
    justifyContent: 'space-between', // This will distribute the cards evenly
  },
  messageCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    height: AVAILABLE_SPACE * 0.25, // First card takes 25% of available space
    marginBottom: 16,
  },
  shiftsCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    height: AVAILABLE_SPACE * 0.25, // Second card takes 25% of available space
    marginBottom: 16,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  messagePreview: {
    flex: 1,
    justifyContent: 'center',
  },
  previewText: {
    color: '#888',
    fontStyle: 'italic',
  },
  shiftsContentPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 8,
    marginTop: 8,
  },
  emptyShiftText: {
    color: '#888',
    fontStyle: 'italic',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: AVAILABLE_SPACE * 0.35, // Last row takes 35% of available space
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    width: '48%',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default HomeScreen;

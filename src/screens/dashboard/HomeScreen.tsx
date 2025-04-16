import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation';
import { useAuth } from '@/context/AuthContext';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomNavigation } from '@/components/common/dashboard';
import NotificationsModal from '@/components/common/NotificationsModal';

const { width, height } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { userData } = useAuth();
  const firstName = userData?.displayName?.split(' ')[0] || 'User';
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  const handleNotificationPress = () => {
    setNotificationsVisible(true);
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

      {/* Welcome Header with properly placed notification icon */}
      <View style={styles.welcomeHeader}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{firstName}</Text>
        </View>
        <TouchableOpacity onPress={handleNotificationPress}>
          <Ionicons name="notifications-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Main Content with adjusted heights */}
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.cardsContainer}>
          {/* Recent Messages Card - Smaller Size */}
          <TouchableOpacity style={[styles.card, styles.smallCard]} onPress={navigateToMessages}>
            <View style={styles.cardContent}>
              <View style={styles.iconTextRow}>
                <FontAwesome name="comments" size={22} color="white" style={styles.cardIcon} />
                <Text style={styles.cardTitle}>Recent Messages</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </View>
          </TouchableOpacity>

          {/* Upcoming Shifts Card - Largest card */}
          <TouchableOpacity style={[styles.card, styles.largeCard]} onPress={navigateToShifts}>
            <View style={styles.cardContent}>
              <View style={styles.iconTextRow}>
                <FontAwesome name="clock-o" size={22} color="white" style={styles.cardIcon} />
                <Text style={styles.cardTitle}>Upcoming Shifts</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </View>
            <View style={styles.cardEmptySpace} />
          </TouchableOpacity>

          {/* Action Buttons Row - Fixed Distance from Bottom Nav */}
          <View style={styles.actionButtonsRow}>
            {/* Walking Distance Card */}
            <TouchableOpacity style={styles.actionButton}>
              <MaterialCommunityIcons
                name="walk"
                size={24}
                color="white"
                style={styles.actionButtonIcon}
              />
              <Text style={styles.actionButtonLabel}>Distance</Text>
              <Text style={styles.actionButtonValue}>0 miles</Text>
            </TouchableOpacity>

            {/* Stairs Climbed Card */}
            <TouchableOpacity style={styles.actionButton}>
              <MaterialCommunityIcons
                name="stairs"
                size={24}
                color="white"
                style={styles.actionButtonIcon}
              />
              <Text style={styles.actionButtonLabel}>Stairs</Text>
              <Text style={styles.actionButtonValue}>0 steps</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Spacer to ensure proper distance from bottom nav */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Notifications Modal */}
      <NotificationsModal
        visible={notificationsVisible}
        onClose={() => setNotificationsVisible(false)}
      />

      {/* Bottom Navigation */}
      <BottomNavigation currentScreen="Home" />
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
    paddingHorizontal: 16,
    marginTop: 80,
    marginBottom: 24,
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
  scrollContent: {
    flex: 1,
  },
  cardsContainer: {
    paddingHorizontal: 16,
    flex: 1,
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 16,
    width: '100%',
  },
  smallCard: {
    height: 150,
    marginBottom: 24,
  },
  largeCard: {
    height: 250,
    marginBottom: 24,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardEmptySpace: {
    flex: 1,
  },
  iconTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    marginRight: 12,
  },
  cardTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    width: '48%',
    aspectRatio: 1.2,
    padding: 16,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  actionButtonIcon: {
    marginBottom: 12,
  },
  actionButtonLabel: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 4,
  },
  actionButtonValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 100,
  },
});

export default HomeScreen;

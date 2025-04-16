import React from 'react';
import { StyleSheet, View, Text, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation';
import { useAuth } from '@/context/AuthContext';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomNavigation } from '@/components/common/dashboard';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { userData } = useAuth();
  const firstName = userData?.displayName?.split(' ')[0] || 'User';

  const handleNotificationPress = () => {};

  const navigateToMessages = () => {
    navigation.navigate('Messages');
  };

  const navigateToShifts = () => {
    navigation.navigate('Calendar');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

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
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.cardsContainer}>
          <TouchableOpacity style={styles.messageCard} onPress={navigateToMessages}>
            <View style={styles.cardContent}>
              <View style={styles.iconTextRow}>
                <FontAwesome name="comments" size={22} color="white" style={styles.cardIcon} />
                <Text style={styles.cardTitle}>Recent Messages</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </View>
          </TouchableOpacity>

          {/* Upcoming Shifts Card */}
          <TouchableOpacity style={styles.shiftsCard} onPress={navigateToShifts}>
            <View style={styles.cardContent}>
              <View style={styles.iconTextRow}>
                <FontAwesome name="clock-o" size={22} color="white" style={styles.cardIcon} />
                <Text style={styles.cardTitle}>Upcoming Shifts</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </View>
            <View style={styles.shiftsContentPlaceholder}>
              <Text style={styles.emptyShiftText}>No upcoming shifts scheduled</Text>
            </View>
          </TouchableOpacity>

          {/* Action Buttons Row */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialCommunityIcons
                name="walk"
                size={24}
                color="white"
                style={styles.actionButtonIcon}
              />
              <Text style={styles.actionButtonLabel}>Distance</Text>
              <Text style={styles.actionButtonValue}>2.4 miles</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <MaterialCommunityIcons
                name="stairs"
                size={24}
                color="white"
                style={styles.actionButtonIcon}
              />
              <Text style={styles.actionButtonLabel}>Stairs</Text>
              <Text style={styles.actionButtonValue}>276 steps</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

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
    paddingHorizontal: 20,
    marginTop: 80,
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
  scrollContent: {
    flex: 1,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  messageCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  shiftsCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  cardIcon: {
    marginRight: 12,
  },
  cardTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  shiftsContentPlaceholder: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#222',
    borderRadius: 8,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyShiftText: {
    color: '#888',
    fontStyle: 'italic',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    width: '48%',
    aspectRatio: 1.5,
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
});

export default HomeScreen;

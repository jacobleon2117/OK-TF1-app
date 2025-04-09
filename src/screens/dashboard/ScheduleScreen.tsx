import React, { useState } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define navigation types that align with your app's structure
type RootStackParamList = {
  Dashboard: undefined;
  Messages: undefined;
  Calendar: undefined;
  Map: undefined;
  Profile: undefined;
  MissionReports: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const ScheduleScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [currentMonth, setCurrentMonth] = useState('March 2025');
  
  // Days of the week
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Calendar data (for visualization purposes)
  const calendarData = [
    ['26', '27', '28', '29', '30', '31', '01'],
    ['2', '3', '4', '5', '6', '7', '8'],
    ['9', '10', '11', '12', '13', '14', '15'],
    ['16', '17', '18', '19', '20', '21', '22'],
    ['23', '24', '25', '26', '27', '28', '29'],
    ['31', '1', '2', '3', '4', '5', '6'],
  ];

  const handlePreviousMonth = () => {
    // In a real app, you would calculate the previous month
    setCurrentMonth('February 2025');
  };

  const handleNextMonth = () => {
    // In a real app, you would calculate the next month
    setCurrentMonth('April 2025');
  };

  const handleBackNavigation = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Top Navigation Bar */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackNavigation}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Schedule</Text>
        <View style={styles.headerRight} />
      </View>
      
      {/* Calendar Container */}
      <ScrollView style={styles.contentContainer}>
        {/* Month Selection */}
        <View style={styles.calendarCard}>
          <View style={styles.monthSelector}>
            <Text style={styles.monthText}>{currentMonth}</Text>
            <View style={styles.monthNavigation}>
              <TouchableOpacity onPress={handlePreviousMonth}>
                <Ionicons name="chevron-back" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNextMonth}>
                <Ionicons name="chevron-forward" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Days of Week Header */}
          <View style={styles.daysHeader}>
            {daysOfWeek.map((day, index) => (
              <Text 
                key={index} 
                style={[
                  styles.dayHeaderText, 
                  index === 6 && styles.highlightedDay
                ]}
              >
                {day}
              </Text>
            ))}
          </View>
          
          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {calendarData.map((week, weekIndex) => (
              <View key={weekIndex} style={styles.weekRow}>
                {week.map((day, dayIndex) => (
                  <TouchableOpacity 
                    key={dayIndex} 
                    style={styles.dayCell}
                  >
                    <Text 
                      style={[
                        styles.dayText, 
                        (dayIndex === 6 || day === '8') && styles.highlightedDay
                      ]}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </View>
        
        {/* Upcoming Shift Section */}
        <View style={styles.shiftCard}>
          <View style={styles.shiftHeader}>
            <FontAwesome name="clock-o" size={18} color="#fff" />
            <Text style={styles.shiftHeaderText}>Upcoming Shift</Text>
          </View>
          {/* Shift details would go here */}
        </View>
      </ScrollView>
      
      {/* Floating Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => navigation.navigate('Dashboard')}
          >
            <FontAwesome name="home" size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navItem}
            // Already on Calendar screen
          >
            <FontAwesome name="calendar" size={24} color="#FF8C00" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('Messages')}
          >
            <FontAwesome name="comments" size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => navigation.navigate('Map')}
          >
            <FontAwesome name="map" size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => navigation.navigate('Profile')}
          >
            <FontAwesome name="user" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 50, // Add extra margin for iOS status bar
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerRight: {
    width: 40,
  },
  contentContainer: {
    flex: 1,
    marginBottom: 80, // Space for the floating nav bar
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  calendarCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  daysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  dayHeaderText: {
    color: '#fff',
    width: 30,
    textAlign: 'center',
    fontSize: 14,
  },
  highlightedDay: {
    color: '#FF8C00', // Orange color for Saturday
  },
  calendarGrid: {
    marginTop: 8,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dayCell: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    color: '#fff',
    fontSize: 14,
  },
  shiftCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    minHeight: 100, // Ensure there's some visible space for shift info
  },
  shiftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  shiftHeaderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 20, // Space from bottom of screen
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  bottomNav: {
    height: 60,
    flexDirection: 'row',
    backgroundColor: '#111',
    borderRadius: 30, // Rounded corners
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

export default ScheduleScreen;
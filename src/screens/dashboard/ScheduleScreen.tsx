import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

// Get screen dimensions for better spacing
const { height } = Dimensions.get('window');

// Define navigation types that align with your app's structure
type RootStackParamList = {
  Dashboard: undefined;
  Messages: undefined;
  Calendar: undefined;
  Map: undefined;
  Profile: undefined;
  MissionReports: undefined;
};

type ScheduleScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const ScheduleScreen = () => {
  const navigation = useNavigation<ScheduleScreenNavigationProp>();
  const [currentMonthDisplay, setCurrentMonthDisplay] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarDays, setCalendarDays] = useState<Array<Array<{day: string; isCurrentMonth: boolean}>>>([]);
  const [today] = useState(new Date());
  
  // Days of the week - ensure no breaking within weekday names
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Get current day of week (0-6)
  const currentDayOfWeek = today.getDay();
  
  // Function to generate calendar data for a given month
  const generateCalendarData = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // First day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    // Last day of the month
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const totalDaysInMonth = lastDayOfMonth.getDate();
    
    // Previous month's last days
    const lastDayOfPrevMonth = new Date(year, month, 0).getDate();
    
    // Calendar grid (6 weeks maximum)
    const calendarGrid: Array<Array<{day: string; isCurrentMonth: boolean}>> = [];
    let dayCounter = 1;
    let nextMonthCounter = 1;
    
    // Generate 6 weeks to ensure consistent calendar size
    for (let week = 0; week < 6; week++) {
      const weekDays: Array<{day: string; isCurrentMonth: boolean}> = [];
      
      for (let day = 0; day < 7; day++) {
        if (week === 0 && day < firstDayOfWeek) {
          // Previous month days
          const prevMonthDay = lastDayOfPrevMonth - (firstDayOfWeek - day - 1);
          weekDays.push({
            day: prevMonthDay.toString(),
            isCurrentMonth: false
          });
        } else if (dayCounter <= totalDaysInMonth) {
          // Current month days
          weekDays.push({
            day: dayCounter.toString(),
            isCurrentMonth: true
          });
          dayCounter++;
        } else {
          // Next month days
          weekDays.push({
            day: nextMonthCounter.toString(),
            isCurrentMonth: false
          });
          nextMonthCounter++;
        }
      }
      
      calendarGrid.push(weekDays);
      
      // Stop generating weeks if we've already covered all days of the month
      // and we've completed at least 4 weeks (for consistent UI)
      if (dayCounter > totalDaysInMonth && week >= 3 && nextMonthCounter > 7) {
        break;
      }
    }
    
    return calendarGrid;
  };
  
  // Initialize calendar and date info
  useEffect(() => {
    updateCalendarMonth(today);
  }, []);
  
  // Update calendar when month changes
  const updateCalendarMonth = (date: Date) => {
    // Update month display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = monthNames[date.getMonth()];
    const year = date.getFullYear();
    setCurrentMonthDisplay(`${monthName} ${year}`);
    
    // Generate calendar data
    const calendarData = generateCalendarData(date);
    setCalendarDays(calendarData);
  };

  const handlePreviousMonth = () => {
    const prevMonth = new Date(selectedDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setSelectedDate(prevMonth);
    updateCalendarMonth(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(selectedDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setSelectedDate(nextMonth);
    updateCalendarMonth(nextMonth);
  };

  const handleDateSelect = (day: string) => {
    // In a real app, this would fetch the user's shifts for this date
    console.log(`Selected day: ${day}`);
  };

  const handleBackNavigation = () => {
    navigation.goBack();
  };

  // Check if the given day is today
  const isToday = (day: string, isCurrentMonth: boolean): boolean => {
    if (!isCurrentMonth) return false;
    
    return (
      parseInt(day) === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };

  // Determine if today is being displayed in the current month view
  const isCurrentMonthView = (): boolean => {
    return (
      selectedDate.getMonth() === today.getMonth() && 
      selectedDate.getFullYear() === today.getFullYear()
    );
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
      <ScrollView 
        style={styles.contentContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Month Selection */}
        <View style={styles.calendarCard}>
          <View style={styles.monthSelector}>
            <Text style={styles.monthText}>{currentMonthDisplay}</Text>
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
              <View key={index} style={styles.dayHeaderContainer}>
                <Text 
                  style={[
                    styles.dayHeaderText, 
                    // Only highlight the current day of week if we're viewing the current month
                    isCurrentMonthView() && index === currentDayOfWeek ? styles.currentDayHeader : null
                  ]}
                >
                  {day}
                </Text>
              </View>
            ))}
          </View>
          
          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {calendarDays.map((week, weekIndex) => (
              <View key={weekIndex} style={styles.weekRow}>
                {week.map((dateObj, dayIndex) => (
                  <TouchableOpacity 
                    key={dayIndex} 
                    style={[
                      styles.dayCell,
                      isToday(dateObj.day, dateObj.isCurrentMonth) && styles.currentDayCell
                    ]}
                    onPress={() => handleDateSelect(dateObj.day)}
                  >
                    <Text 
                      style={[
                        styles.dayText, 
                        !dateObj.isCurrentMonth && styles.adjacentMonthDay,
                        isToday(dateObj.day, dateObj.isCurrentMonth) && styles.currentDayText
                      ]}
                    >
                      {dateObj.day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </View>
        
        {/* Upcoming Shift Section - now with proper spacing */}
        <View style={styles.shiftCard}>
          <View style={styles.shiftHeader}>
            <FontAwesome name="clock-o" size={18} color="#fff" />
            <Text style={styles.shiftHeaderText}>Upcoming Shift</Text>
          </View>
          
          <Text style={styles.noShiftText}>No upcoming shifts scheduled</Text>
        </View>

        {/* Spacer to ensure content doesn't touch bottom nav */}
        <View style={styles.bottomSpacer} />
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
            onPress={() => navigation.navigate('MissionReports')}
          >
            <FontAwesome name="file-text-o" size={22} color="#fff" />
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
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    marginTop: 50, // Add extra margin for iOS status bar
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
    marginLeft: 8, // Move title closer to back arrow
  },
  headerRight: {
    width: 40,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
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
  dayHeaderContainer: {
    width: 30,
    alignItems: 'center',
  },
  dayHeaderText: {
    color: '#fff',
    fontSize: 14,
  },
  currentDayHeader: {
    color: '#FF8C00', // Orange color for current day of week
    fontWeight: 'bold',
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
  currentDayCell: {
    backgroundColor: '#222',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FF8C00',
  },
  dayText: {
    color: '#fff',
    fontSize: 14,
  },
  currentDayText: {
    color: '#FF8C00',
    fontWeight: 'bold',
  },
  adjacentMonthDay: {
    color: '#444', // Darkened color for days not in current month
  },
  shiftCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    minHeight: height * 0.25, // Make card take up space but not too much
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
  noShiftText: {
    color: '#aaa',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 10,
  },
  // Add a spacer at the bottom to ensure content doesn't touch navigation
  bottomSpacer: {
    height: 100, // Plenty of space to ensure no touching
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

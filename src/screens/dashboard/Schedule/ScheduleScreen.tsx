import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { RootStackScreenNavigationProp } from '@/types/navigation';

import {
  generateCalendarData,
  isToday,
  getCurrentDayOfWeek,
} from '@/screens/dashboard/Schedule/scheduleUtils';
import {
  getMonthName,
  getDaysOfWeek,
  isCurrentMonthView,
  addMonths,
} from '@/screens/dashboard/Schedule/scheduleUtils';
import { fetchShifts, Shift } from '@/screens/dashboard/Schedule/scheduleUtils';

import { Timestamp } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';

// Import the FloatingBottomNav component
import FloatingBottomNav from '@/components/common/dashboard/BottomNavigation';

const { height } = Dimensions.get('window');

const ScheduleScreen = () => {
  const navigation = useNavigation<RootStackScreenNavigationProp<'Calendar'>>();

  const { user } = useAuth();

  const [currentMonthDisplay, setCurrentMonthDisplay] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarDays, setCalendarDays] = useState<
    Array<Array<{ day: string; isCurrentMonth: boolean }>>
  >([]);
  const [today] = useState(new Date());
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const daysOfWeek = getDaysOfWeek();
  const currentDayOfWeek = getCurrentDayOfWeek();

  useEffect(() => {
    // TODO: We need to add error handling and potential loading state
    updateCalendarMonth(today);
    loadShifts();
  }, []);

  const updateCalendarMonth = (date: Date) => {
    const monthName = getMonthName(date);
    const year = date.getFullYear();
    setCurrentMonthDisplay(`${monthName} ${year}`);

    const calendarData = generateCalendarData(date);
    setCalendarDays(calendarData);
  };

  const loadShifts = async () => {
    setIsLoading(true);
    try {
      const fetchedShifts = await fetchShifts(selectedDate);
      setShifts(fetchedShifts);
    } catch (error) {
      console.error('Error loading shifts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousMonth = () => {
    const prevMonth = addMonths(selectedDate, -1);
    setSelectedDate(prevMonth);
    updateCalendarMonth(prevMonth);
    loadShifts();
  };

  const handleNextMonth = () => {
    const nextMonth = addMonths(selectedDate, 1);
    setSelectedDate(nextMonth);
    updateCalendarMonth(nextMonth);
    loadShifts();
  };

  const handleDateSelect = (day: string, isCurrentMonth: boolean) => {
    if (isCurrentMonth) {
      const selectedDateTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        parseInt(day)
      );
      console.log(`Selected day: ${selectedDateTime.toDateString()}`);
    }
  };

  const formatShiftTime = (timestamp: Timestamp): string => {
    try {
      return timestamp.toDate().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Error formatting shift time:', error);
      return 'Invalid Time';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Top Navigation Bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Schedule</Text>
        <View style={styles.headerRight} />
      </View>
      {/* Calendar Container */}
      <View style={styles.contentContainer}>
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
                    isCurrentMonthView(selectedDate, today) && index === currentDayOfWeek
                      ? styles.currentDayHeader
                      : null,
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
                      isToday(dateObj.day, dateObj.isCurrentMonth, selectedDate, today) &&
                        styles.currentDayCell,
                    ]}
                    onPress={() => handleDateSelect(dateObj.day, dateObj.isCurrentMonth)}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        !dateObj.isCurrentMonth && styles.adjacentMonthDay,
                        isToday(dateObj.day, dateObj.isCurrentMonth, selectedDate, today) &&
                          styles.currentDayText,
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

        {/* Upcoming Shift Section */}
        <View style={styles.shiftCard}>
          <View style={styles.shiftHeader}>
            <FontAwesome name="clock-o" size={18} color="#fff" />
            <Text style={styles.shiftHeaderText}>Upcoming Shifts</Text>
          </View>

          {isLoading ? (
            <Text style={styles.loadingText}>Loading shifts...</Text>
          ) : shifts.length === 0 ? (
            <Text style={styles.noShiftText}>No upcoming shifts scheduled</Text>
          ) : (
            shifts.map(shift => (
              <View key={shift.id} style={styles.shiftItem}>
                <Text style={styles.shiftText}>{shift.description}</Text>
                <Text style={styles.shiftSubText}>{formatShiftTime(shift.startTime)}</Text>
              </View>
            ))
          )}
        </View>
      </View>
      {/* Floating Bottom Navigation */}
      <FloatingBottomNav currentScreen="Calendar" />
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
    marginTop: 50,
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
    marginLeft: 8,
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
    color: '#FF8C00',
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
    color: '#444',
  },
  shiftCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    minHeight: height * 0.25,
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
  bottomSpacer: {
    height: 100,
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    padding: 10,
  },
  shiftItem: {
    backgroundColor: '#222',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  shiftText: {
    color: '#fff',
  },
  shiftSubText: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 4,
  },
});

export default ScheduleScreen;

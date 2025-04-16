import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ScrollView,
} from 'react-native';
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
import { useAuth } from '@/context/AuthContext';

// Import components
import BottomNavigation from '@/components/common/dashboard/BottomNavigation';
import HeaderWithNotifications from '@/components/common/HeaderWithNotifications';

const { width, height } = Dimensions.get('window');

interface CalendarDay {
  day: string;
  isCurrentMonth: boolean;
}

const ScheduleScreen = () => {
  const navigation = useNavigation<RootStackScreenNavigationProp<'Calendar'>>();
  const { user } = useAuth();

  const [currentMonthDisplay, setCurrentMonthDisplay] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [calendarDays, setCalendarDays] = useState<Array<Array<CalendarDay>>>([]);
  const [today] = useState(new Date());
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [upcomingShifts, setUpcomingShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const daysOfWeek = getDaysOfWeek();
  const currentDayOfWeek = getCurrentDayOfWeek();

  useEffect(() => {
    updateCalendarMonth(today);
    loadShifts();
  }, []);

  useEffect(() => {
    // Filter shifts to show only upcoming ones
    const currentTime = new Date().getTime();
    const filtered = shifts.filter(shift => {
      const shiftTime = shift.startTime.toDate().getTime();
      return shiftTime >= currentTime;
    });

    // Sort by date (nearest first)
    filtered.sort((a, b) => a.startTime.toDate().getTime() - b.startTime.toDate().getTime());

    setUpcomingShifts(filtered);
  }, [shifts]);

  const updateCalendarMonth = (date: Date) => {
    const monthName = getMonthName(date);
    const year = date.getFullYear();
    setCurrentMonthDisplay(`${monthName} ${year}`);

    const calendarData = generateCalendarData(date);
    setCalendarDays(calendarData);

    // Set the current day as selected initially
    setSelectedDay(date.getDate().toString());
  };

  const loadShifts = async () => {
    setIsLoading(true);
    try {
      // Fetch shifts for the whole month to show upcoming shifts
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
      setSelectedDay(day);

      const selectedDateTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        parseInt(day)
      );

      // Optionally filter shifts for this specific day
      const filtered = shifts.filter(shift => {
        const shiftDate = shift.startTime.toDate();
        return (
          shiftDate.getFullYear() === selectedDateTime.getFullYear() &&
          shiftDate.getMonth() === selectedDateTime.getMonth() &&
          shiftDate.getDate() === selectedDateTime.getDate()
        );
      });
    }
  };

  const handleBackNavigation = () => {
    navigation.goBack();
  };

  const formatShiftTime = (timestamp: Timestamp): string => {
    try {
      const date = timestamp.toDate();
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch (error) {
      console.error('Error formatting shift time:', error);
      return 'Invalid Time';
    }
  };

  const formatShiftDate = (timestamp: Timestamp): string => {
    try {
      const date = timestamp.toDate();
      return date.toLocaleDateString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting shift date:', error);
      return 'Invalid Date';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <HeaderWithNotifications
        title="Schedule"
        showBackButton={true}
        onBackPress={handleBackNavigation}
      />

      {/* Calendar Container */}
      <ScrollView style={styles.scrollContent}>
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
              {calendarDays.map((week: Array<CalendarDay>, weekIndex: number) => (
                <View key={weekIndex} style={styles.weekRow}>
                  {week.map((dateObj: CalendarDay, dayIndex: number) => (
                    <TouchableOpacity
                      key={dayIndex}
                      style={[
                        styles.dayCell,
                        // Current day highlight
                        isToday(dateObj.day, dateObj.isCurrentMonth, selectedDate, today) &&
                          styles.currentDayCell,
                        // Selected day highlight
                        dateObj.isCurrentMonth &&
                          dateObj.day === selectedDay &&
                          styles.selectedDayCell,
                      ]}
                      onPress={() => handleDateSelect(dateObj.day, dateObj.isCurrentMonth)}
                      disabled={!dateObj.isCurrentMonth}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          !dateObj.isCurrentMonth && styles.adjacentMonthDay,
                          isToday(dateObj.day, dateObj.isCurrentMonth, selectedDate, today) &&
                            styles.currentDayText,
                          dateObj.isCurrentMonth &&
                            dateObj.day === selectedDay &&
                            styles.selectedDayText,
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
            ) : upcomingShifts.length === 0 ? (
              <Text style={styles.noShiftText}>No upcoming shifts scheduled</Text>
            ) : (
              <FlatList
                data={upcomingShifts}
                keyExtractor={item => item.id || Math.random().toString()}
                renderItem={({ item }) => (
                  <View style={styles.shiftItem}>
                    <View style={styles.shiftDateContainer}>
                      <Text style={styles.shiftDate}>{formatShiftDate(item.startTime)}</Text>
                    </View>
                    <View style={styles.shiftDetails}>
                      <Text style={styles.shiftTitle}>{item.description}</Text>
                      <Text style={styles.shiftTime}>
                        {`${formatShiftTime(item.startTime)} - ${formatShiftTime(item.endTime)}`}
                      </Text>
                      <Text style={styles.shiftLocation}>
                        {item.location?.name || 'No location specified'}
                      </Text>
                    </View>
                  </View>
                )}
                style={styles.shiftList}
                contentContainerStyle={styles.shiftListContent}
              />
            )}
          </View>

          {/* Spacer to ensure proper distance from bottom nav */}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      <BottomNavigation currentScreen="Calendar" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  calendarCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '100%',
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
    width: (width - 64) / 7, // Account for padding and equal division
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
    width: (width - 64) / 7, // Account for padding and equal division
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  currentDayCell: {
    backgroundColor: '#222',
    borderWidth: 1,
    borderColor: '#FF8C00',
  },
  selectedDayCell: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#fff',
  },
  dayText: {
    color: '#fff',
    fontSize: 14,
  },
  currentDayText: {
    color: '#FF8C00',
    fontWeight: 'bold',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  adjacentMonthDay: {
    color: '#444',
  },
  shiftCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    width: '100%',
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
    textAlign: 'center',
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    padding: 10,
  },
  shiftList: {
    maxHeight: 300, // Limit height to prevent overflow
  },
  shiftListContent: {
    paddingBottom: 16,
  },
  shiftItem: {
    backgroundColor: '#222',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  shiftDateContainer: {
    backgroundColor: '#FF8C00',
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  shiftDate: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
  },
  shiftDetails: {
    padding: 12,
  },
  shiftTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  shiftTime: {
    color: '#ddd',
    fontSize: 14,
    marginBottom: 4,
  },
  shiftLocation: {
    color: '#aaa',
    fontSize: 12,
  },
  bottomSpacer: {
    height: 120, // Increased height to ensure proper spacing from bottom nav
  },
});

export default ScheduleScreen;

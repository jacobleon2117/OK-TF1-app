import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  StatusBar, 
  TouchableOpacity, 
  ScrollView,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  Dimensions 
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { RootStackScreenNavigationProp } from '@/@types/navigation';

// utility functions
import { 
  generateCalendarData, 
  isToday, 
  getCurrentDayOfWeek 
} from '@utils/dashboard/scheduleUtils/calendarHelpers';
import { 
  getMonthName, 
  getDaysOfWeek, 
  isCurrentMonthView,
  addMonths,
  formatDate
} from '@utils/dashboard/scheduleUtils/dateUtilities';
import { 
  fetchShifts, 
  formatShiftTime,
  Shift
} from '@utils/dashboard/scheduleUtils/shiftUtils';

// admin utility functions
import {
  createNewShift,
  updateExistingShift,
  deleteExistingShift,
  assignTeamMemberToShift,
  getAllTeamMembers,
  UserData
} from '@utils/dashboard/scheduleUtils/adminUtils';

// firebase imports
import { Timestamp, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { addShift, deleteShift, updateShiftStatus } from '../../services/firebase/schedulingService';

// get users screen dimensions for better spacing on different screen sizes
const { height, width } = Dimensions.get('window');

const AdminScheduleScreen = () => {
  const navigation = useNavigation<RootStackScreenNavigationProp<'Calendar'>>();
  
  // get the current authenticated user
  const { user } = useAuth();

  // state management
  const [currentMonthDisplay, setCurrentMonthDisplay] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarDays, setCalendarDays] = useState<Array<Array<{day: string; isCurrentMonth: boolean}>>>([]);
  const [today] = useState(new Date());
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Team members state
  const [teamMembers, setTeamMembers] = useState<UserData[]>([]);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<UserData[]>([]);
  
  // Admin modal states
  const [isCreateShiftModalVisible, setCreateShiftModalVisible] = useState(false);
  const [isEditShiftModalVisible, setEditShiftModalVisible] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  
  // Shift form states
  const [shiftDescription, setShiftDescription] = useState('');
  const [shiftLocation, setShiftLocation] = useState('');
  const [shiftStartTime, setShiftStartTime] = useState(new Date());
  const [shiftEndTime, setShiftEndTime] = useState(new Date(new Date().getTime() + 3600000)); // Default to 1 hour later

  // days of the week and the current day
  const daysOfWeek = getDaysOfWeek();
  const currentDayOfWeek = getCurrentDayOfWeek();

  // Fetch team members on component mount
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const members = await getAllTeamMembers();
        setTeamMembers(members);
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
    };

    fetchTeamMembers();
  }, []);

  // Toggle team member selection
  const toggleTeamMemberSelection = (member: UserData) => {
    setSelectedTeamMembers(prev => 
      prev.some(m => m.id === member.id)
        ? prev.filter(m => m.id !== member.id)
        : [...prev, member]
    );
  };

  // lifecycle and data fetching methods
  useEffect(() => {
    updateCalendarMonth(today);
    loadShifts();
  }, []);

  // update calendar month and generate the calendar data
  const updateCalendarMonth = (date: Date) => {
    const monthName = getMonthName(date);
    const year = date.getFullYear();
    setCurrentMonthDisplay(`${monthName} ${year}`);
    
    const calendarData = generateCalendarData(date);
    setCalendarDays(calendarData);
  };

  // fetch shifts for the selected date
  const loadShifts = async () => {
    setIsLoading(true);
    try {
      const fetchedShifts = await fetchShifts(selectedDate);
      setShifts(fetchedShifts);
    } catch (error) {
      console.error('Error loading shifts:', error);
      Alert.alert('Error', 'Failed to load shifts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // month navigation handlers
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

  // date selection handler
  const handleDateSelect = (day: string, isCurrentMonth: boolean) => {
    if (isCurrentMonth) {
      const selectedDateTime = new Date(
        selectedDate.getFullYear(), 
        selectedDate.getMonth(), 
        parseInt(day)
      );
      
      setSelectedDate(selectedDateTime);
      // Reload shifts for the selected date
      loadShifts();
    }
  };

const handleCreateShift = async () => {
    if (!shiftDescription || !shiftLocation) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    
    setIsLoading(true);
    try {
      const newShift = {
        description: shiftDescription,
        location: {
          name: shiftLocation,
          address: '', // Optional, can be added later
        },
        startTime: Timestamp.fromDate(shiftStartTime),
        endTime: Timestamp.fromDate(shiftEndTime),
        status: 'active',
      };
      
      // Create the shift
      const shiftRef = await addShift(newShift);
      
      // Assign selected team members to the shift
      await Promise.all(
        selectedTeamMembers.map(member => 
          assignTeamMemberToShift(
            shiftRef.id, 
            member.id, 
            member.displayName, 
            member.role
          )
        )
      );
    
    // Reset form and close modal
    resetShiftForm();
    setCreateShiftModalVisible(false);
    
    // Reload shifts
    loadShifts();
    
      Alert.alert('Success', 'Shift created and team members assigned');
    } catch (error) {
      console.error('Error creating shift:', error);
      Alert.alert('Error', 'Failed to create shift');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateShift = async () => {
    if (!selectedShift || !selectedShift.id) {
      return;
    }
    
    if (!shiftDescription || !shiftLocation) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    
    setIsLoading(true);
    try {
      // Update shift details
      const updatedData = {
        description: shiftDescription,
        location: {
          name: shiftLocation,
          address: selectedShift.location.address || '',
        },
        startTime: Timestamp.fromDate(shiftStartTime),
        endTime: Timestamp.fromDate(shiftEndTime),
        status: 'updated',
      };
      
      // In a real app, you would update all shift fields
      // For now, we'll just update the status as example
      await updateShiftStatus(selectedShift.id, 'updated');
      
      // Reset form and close modal
      resetShiftForm();
      setEditShiftModalVisible(false);
      
      // Reload shifts
      loadShifts();
      
      Alert.alert('Success', 'Shift updated successfully');
    } catch (error) {
      console.error('Error updating shift:', error);
      Alert.alert('Error', 'Failed to update shift');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteShift = async () => {
  if (!selectedShift || !selectedShift.id) {
    return;
  }
  
  Alert.alert(
    'Confirm Delete',
    'Are you sure you want to delete this shift?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setIsLoading(true);
          try {
            // Make sure id is defined before calling deleteShift
            if (selectedShift.id) {
              await deleteShift(selectedShift.id);
              
              // Reset form and close modal
              resetShiftForm();
              setEditShiftModalVisible(false);
              
              // Reload shifts
              loadShifts();
              
              Alert.alert('Success', 'Shift deleted successfully');
            } else {
              throw new Error('Shift ID is undefined');
            }
          } catch (error) {
            console.error('Error deleting shift:', error);
            Alert.alert('Error', 'Failed to delete shift');
          } finally {
            setIsLoading(false);
          }
        },
      },
    ],
  );
};
  
  // Helper functions
  const resetShiftForm = () => {
    setShiftDescription('');
    setShiftLocation('');
    setShiftStartTime(new Date());
    setShiftEndTime(new Date(new Date().getTime() + 3600000));
    setSelectedShift(null);
    setSelectedTeamMembers([]); // Reset selected team members
  };
  
  const handleOpenCreateShiftModal = () => {
    resetShiftForm();
    setCreateShiftModalVisible(true);
  };
  
  const handleOpenEditShiftModal = (shift: Shift) => {
    setSelectedShift(shift);
    setShiftDescription(shift.description);
    setShiftLocation(shift.location.name);
    setShiftStartTime(shift.startTime.toDate());
    setShiftEndTime(shift.endTime.toDate());
    setEditShiftModalVisible(true);
  };
  
  // Navigate to Admin Setup
  const navigateToAdminSetup = () => {
    navigation.navigate('AdminSetup');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Top Navigation Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Coordinator Schedule</Text>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleOpenCreateShiftModal}
        >
          <Ionicons name="add-circle" size={24} color="#FF8C00" />
        </TouchableOpacity>
      </View>
      
      {/* Admin Badge */}
      <View style={styles.adminBadge}>
        <FontAwesome name="shield" size={12} color="#FF8C00" />
        <Text style={styles.adminBadgeText}>Coordinator View</Text>
      </View>
      
      {/* Calendar Container */}
      <ScrollView style={styles.contentContainer}>
        <View style={styles.scrollContent}>
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
                      isCurrentMonthView(selectedDate, today) && 
                      index === currentDayOfWeek ? 
                      styles.currentDayHeader : null
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
                        isToday(
                          dateObj.day, 
                          dateObj.isCurrentMonth, 
                          selectedDate, 
                          today
                        ) && styles.currentDayCell,
                        selectedDate.getDate() === parseInt(dateObj.day) && 
                        dateObj.isCurrentMonth && styles.selectedDayCell
                      ]}
                      onPress={() => handleDateSelect(dateObj.day, dateObj.isCurrentMonth)}
                    >
                      <Text 
                        style={[
                          styles.dayText, 
                          !dateObj.isCurrentMonth && styles.adjacentMonthDay,
                          isToday(
                            dateObj.day, 
                            dateObj.isCurrentMonth, 
                            selectedDate, 
                            today
                          ) && styles.currentDayText,
                          selectedDate.getDate() === parseInt(dateObj.day) && 
                          dateObj.isCurrentMonth && styles.selectedDayText
                        ]}
                      >
                        {dateObj.day}
                      </Text>
                      
                      {/* Dot indicator for days with shifts */}
                      {shifts.some(shift => {
                        const shiftDate = shift.startTime.toDate();
                        return (
                          dateObj.isCurrentMonth &&
                          parseInt(dateObj.day) === shiftDate.getDate() &&
                          selectedDate.getMonth() === shiftDate.getMonth() &&
                          selectedDate.getFullYear() === shiftDate.getFullYear()
                        );
                      }) && (
                        <View style={styles.shiftIndicator} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          </View>
          
          {/* Selected Date Display */}
          <View style={styles.selectedDateContainer}>
            <Text style={styles.selectedDateText}>
              {selectedDate.toDateString()}
            </Text>
          </View>
          
          {/* Shifts Section */}
          <View style={styles.shiftCard}>
            <View style={styles.shiftHeader}>
              <FontAwesome name="clock-o" size={18} color="#fff" />
              <Text style={styles.shiftHeaderText}>
                Manage Shifts
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.createShiftButton}
              onPress={handleOpenCreateShiftModal}
            >
              <Text style={styles.createShiftText}>+ Create New Shift</Text>
            </TouchableOpacity>
            
            {isLoading ? (
              <ActivityIndicator size="large" color="#FF8C00" style={styles.loadingIndicator} />
            ) : shifts.length === 0 ? (
              <View style={styles.noShiftsContainer}>
                <Text style={styles.noShiftText}>No shifts scheduled for this date</Text>
              </View>
            ) : (
              <View>
                {shifts.map((shift) => (
                  <TouchableOpacity 
                    key={shift.id} 
                    style={styles.shiftItem}
                    onPress={() => handleOpenEditShiftModal(shift)}
                  >
                    <View style={styles.shiftItemHeader}>
                      <Text style={styles.shiftTitle}>{shift.description}</Text>
                      <Ionicons name="create-outline" size={18} color="#FF8C00" />
                    </View>
                    
                    <Text style={styles.shiftTime}>
                      {`${formatShiftTime(shift.startTime)} - ${formatShiftTime(shift.endTime)}`}
                    </Text>
                    
                    <Text style={styles.shiftLocation}>
                      Location: {shift.location.name}
                    </Text>
                    
                    <View style={styles.adminShiftControls}>
                      <Text style={styles.statusText}>Status: {shift.status}</Text>
                      <Text style={styles.assignedText}>
                        {shift.assignedUsers?.length || 0} team members assigned
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          
          {/* Admin Control Section */}
          <View style={styles.adminCard}>
            <View style={styles.adminHeader}>
              <FontAwesome name="shield" size={18} color="#FF8C00" />
              <Text style={styles.adminHeaderText}>Coordinator Controls</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.adminButton}
              onPress={handleOpenCreateShiftModal}
            >
              <Text style={styles.adminButtonText}>Create New Shift</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.adminButton}
              onPress={() => Alert.alert('Coming Soon', 'Team availability view will be available in the next update.')}
            >
              <Text style={styles.adminButtonText}>View Team Availability</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.adminButton}
              onPress={() => Alert.alert('Coming Soon', 'Shift templates will be available in the next update.')}
            >
              <Text style={styles.adminButtonText}>Manage Shift Templates</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.adminButton}
              onPress={navigateToAdminSetup}
            >
              <Text style={styles.adminButtonText}>Admin Setup</Text>
            </TouchableOpacity>
          </View>
          
          {/* Add spacing at the bottom for the floating nav */}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
      
      {/* Create Shift Modal */}
<Modal
  visible={isCreateShiftModalVisible}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setCreateShiftModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Create New Shift</Text>
        <TouchableOpacity onPress={() => setCreateShiftModalVisible(false)}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.modalForm}>
        {/* Existing input fields */}
        <Text style={styles.inputLabel}>Description *</Text>
        <TextInput
          style={styles.input}
          value={shiftDescription}
          onChangeText={setShiftDescription}
          placeholder="Enter shift description"
          placeholderTextColor="#666"
        />
        
        <Text style={styles.inputLabel}>Location *</Text>
        <TextInput
          style={styles.input}
          value={shiftLocation}
          onChangeText={setShiftLocation}
          placeholder="Enter location"
          placeholderTextColor="#666"
        />
        
        {/* Team Member Selection */}
        <Text style={styles.inputLabel}>Assign Team Members</Text>
        <ScrollView 
          horizontal 
          style={styles.teamMemberScrollView}
          showsHorizontalScrollIndicator={false}
        >
          {teamMembers.map(member => (
            <TouchableOpacity 
              key={member.id}
              style={[
                styles.teamMemberItem,
                selectedTeamMembers.some(m => m.id === member.id) && styles.selectedTeamMember
              ]}
              onPress={() => toggleTeamMemberSelection(member)}
            >
              <Text style={styles.teamMemberText}>{member.displayName}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {/* Date and Time Selection */}
        <Text style={styles.inputLabel}>Shift Date</Text>
        <View style={styles.dateSelectionContainer}>
          {calendarDays.flat().map((dateObj, index) => (
            dateObj.isCurrentMonth && (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateSelectionCell,
                  selectedDate.getDate() === parseInt(dateObj.day) && styles.selectedDateCell
                ]}
                onPress={() => {
                  const newDate = new Date(
                    selectedDate.getFullYear(), 
                    selectedDate.getMonth(), 
                    parseInt(dateObj.day)
                  );
                  setShiftStartTime(newDate);
                  setShiftEndTime(new Date(newDate.getTime() + 3600000)); // 1 hour later
                }}
              >
                <Text style={styles.dateSelectionText}>{dateObj.day}</Text>
              </TouchableOpacity>
            )
          ))}
        </View>
        
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleCreateShift}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.submitButtonText}>Create Shift</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
      
      {/* Edit Shift Modal */}
      <Modal
        visible={isEditShiftModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditShiftModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Shift</Text>
              <TouchableOpacity onPress={() => setEditShiftModalVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalForm}>
              <Text style={styles.inputLabel}>Description *</Text>
              <TextInput
                style={styles.input}
                value={shiftDescription}
                onChangeText={setShiftDescription}
                placeholder="Enter shift description"
                placeholderTextColor="#666"
              />
              
              <Text style={styles.inputLabel}>Location *</Text>
              <TextInput
                style={styles.input}
                value={shiftLocation}
                onChangeText={setShiftLocation}
                placeholder="Enter location"
                placeholderTextColor="#666"
              />
              
              <Text style={styles.inputLabel}>Date and Time</Text>
              <Text style={styles.timeText}>
                Start: {shiftStartTime.toLocaleString()}
              </Text>
              
              <Text style={styles.timeText}>
                End: {shiftEndTime.toLocaleString()}
              </Text>
              
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={styles.updateButton}
                  onPress={handleUpdateShift}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Text style={styles.submitButtonText}>Update</Text>
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={handleDeleteShift}
                  disabled={isLoading}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={styles.assignButton}
                onPress={() => {
                  Alert.alert('Coming Soon', 'Team assignment will be available in the next update.');
                }}
              >
                <Text style={styles.assignButtonText}>Assign Team Members</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Floating Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => Alert.alert('Coming Soon', 'Dashboard will be available in a future update.')}
          >
            <FontAwesome name="home" size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navItem}
            // already on Calendar screen
          >
            <FontAwesome name="calendar" size={24} color="#FF8C00" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => Alert.alert('Coming Soon', 'Messages will be available in a future update.')}
          >
            <FontAwesome name="comments" size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => Alert.alert('Coming Soon', 'Map will be available in a future update.')}
          >
            <FontAwesome name="map" size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => Alert.alert('Coming Soon', 'Mission Reports will be available in a future update.')}
          >
            <FontAwesome name="file-text-o" size={22} color="#fff" />
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
    marginTop: 50, // add extra margin for iOS status bar
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 140, 0, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginLeft: 16,
    marginBottom: 12,
  },
  adminBadgeText: {
    color: '#FF8C00',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
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
    color: '#FF8C00', // orange color for current day of week
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
  selectedDayCell: {
    backgroundColor: '#333',
    borderRadius: 15,
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
    color: '#444', // darkened color for days not in current month
  },
  shiftIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FF8C00',
    position: 'absolute',
    bottom: 2,
  },
  selectedDateContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedDateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  shiftCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    minHeight: 150,
  },
  shiftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  shiftHeaderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  createShiftButton: {
    backgroundColor: '#222',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF8C00',
    marginBottom: 16,
  },
  createShiftText: {
    color: '#FF8C00',
    fontWeight: 'bold',
  },
  noShiftsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  noShiftText: {
    color: '#aaa',
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  shiftItem: {
    backgroundColor: '#222',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FF8C00',
  },
  shiftItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  shiftTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  shiftTime: {
    color: '#ddd',
    fontSize: 12,
    marginBottom: 4,
  },
  shiftLocation: {
    color: '#aaa',
    fontSize: 12,
  },
  adminShiftControls: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  statusText: {
    color: '#FF8C00',
    fontSize: 12,
    fontStyle: 'italic',
  },
  assignedText: {
    color: '#aaa',
    fontSize: 12,
  },
  adminCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  adminHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  adminHeaderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  adminButton: {
    backgroundColor: '#222',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  adminButtonText: {
    color: '#FF8C00',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 100, // Add space at the bottom so content isn't hidden behind floating nav
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 20, // space from bottom of screen
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  bottomNav: {
    height: 60,
    flexDirection: 'row',
    backgroundColor: '#111',
    borderRadius: 30, // rounded corners
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
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 20,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalForm: {
    paddingBottom: 20,
  },
  inputLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  timeText: {
    color: '#ddd',
    marginBottom: 8,
  },
  noteText: {
    color: '#aaa',
    fontStyle: 'italic',
    fontSize: 12,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  updateButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#8B0000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  assignButton: {
    backgroundColor: '#222',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF8C00',
    marginTop: 10,
  },
  assignButtonText: {
    color: '#FF8C00',
    fontWeight: 'bold',
  },
  teamMemberScrollView: {
  marginBottom: 16,
},
teamMemberItem: {
  backgroundColor: '#222',
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 8,
  marginRight: 8,
},
selectedTeamMember: {
  backgroundColor: '#FF8C00',
},
teamMemberText: {
  color: '#fff',
},
dateSelectionContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  marginBottom: 16,
},
dateSelectionCell: {
  width: 40,
  height: 40,
  justifyContent: 'center',
  alignItems: 'center',
  margin: 4,
  borderRadius: 20,
  backgroundColor: '#222',
},
selectedDateCell: {
  backgroundColor: '#FF8C00',
},
dateSelectionText: {
  color: '#fff',
},
});

export default AdminScheduleScreen;
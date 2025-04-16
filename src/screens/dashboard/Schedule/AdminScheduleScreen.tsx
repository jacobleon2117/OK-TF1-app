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
  Dimensions,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { RootStackScreenNavigationProp } from '@/types/navigation';

import {
  generateCalendarData,
  isToday,
  getCurrentDayOfWeek,
} from '@/screens/dashboard/Schedule/scheduleUtils/calendarHelpers';
import {
  getMonthName,
  getDaysOfWeek,
  isCurrentMonthView,
  addMonths,
  formatDate,
} from '@/screens/dashboard/Schedule/scheduleUtils/dateUtilities';
import {
  fetchShifts,
  formatShiftTime,
  Shift,
} from '@/screens/dashboard/Schedule/scheduleUtils/shiftUtils';

import {
  createNewShift,
  updateExistingShift,
  deleteExistingShift,
  assignTeamMemberToShift,
  getAllTeamMembers,
  UserData,
  getShiftAssignments,
} from '@/screens/dashboard/Schedule/scheduleUtils/adminUtils';

import { Timestamp, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';
import { addShift, deleteShift } from '@/services/firebase/schedulingService';

const { height, width } = Dimensions.get('window');

const TimePicker = ({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (time: string) => void;
  label: string;
}) => {
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute of [0, 30]) {
      const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
      const formattedMinute = minute === 0 ? '00' : '30';
      timeOptions.push(`${formattedHour}:${formattedMinute}`);
    }
  }

  return (
    <View style={styles.timePickerContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.pickerContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.timeOptionsContainer}
        >
          {timeOptions.map(time => (
            <TouchableOpacity
              key={time}
              style={[styles.timeOption, value === time && styles.selectedTimeOption]}
              onPress={() => onChange(time)}
            >
              <Text style={value === time ? styles.selectedTimeText : styles.timeText}>{time}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const AdminScheduleScreen = () => {
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

  const [teamMembers, setTeamMembers] = useState<UserData[]>([]);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<UserData[]>([]);

  const [isCreateShiftModalVisible, setCreateShiftModalVisible] = useState(false);
  const [isEditShiftModalVisible, setEditShiftModalVisible] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  const [selectedStartTime, setSelectedStartTime] = useState('09:00');
  const [selectedEndTime, setSelectedEndTime] = useState('17:00');
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const [shiftDescription, setShiftDescription] = useState('');
  const [shiftLocation, setShiftLocation] = useState('');

  const daysOfWeek = getDaysOfWeek();
  const currentDayOfWeek = getCurrentDayOfWeek();

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

  const toggleTeamMemberSelection = (member: UserData) => {
    setSelectedTeamMembers(prev =>
      prev.some(m => m.id === member.id) ? prev.filter(m => m.id !== member.id) : [...prev, member]
    );
  };

  useEffect(() => {
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

      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

      Alert.alert(
        'Error Loading Shifts',
        `There was a problem loading your shifts. ${errorMessage}`,
        [
          {
            text: 'Retry',
            onPress: () => loadShifts(),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
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
    if (!isCurrentMonth) return;

    const selectedDateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      parseInt(day)
    );

    const isDateSelected = selectedDates.some(
      date =>
        date.getDate() === selectedDateTime.getDate() &&
        date.getMonth() === selectedDateTime.getMonth() &&
        date.getFullYear() === selectedDateTime.getFullYear()
    );

    if (isDateSelected) {
      setSelectedDates(prev =>
        prev.filter(
          date =>
            !(
              date.getDate() === selectedDateTime.getDate() &&
              date.getMonth() === selectedDateTime.getMonth() &&
              date.getFullYear() === selectedDateTime.getFullYear()
            )
        )
      );
    } else {
      setSelectedDates(prev => [...prev, selectedDateTime]);
    }
  };

  const handleCreateShift = async () => {
    if (!shiftDescription || !shiftLocation) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (selectedDates.length === 0) {
      Alert.alert('Error', 'Please select at least one date');
      return;
    }

    const [startHour, startMinute] = selectedStartTime.split(':').map(Number);
    const [endHour, endMinute] = selectedEndTime.split(':').map(Number);

    setIsLoading(true);
    try {
      for (const selectedDate of selectedDates) {
        const startDateTime = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          startHour,
          startMinute
        );

        const endDateTime = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          endHour,
          endMinute
        );

        if (endDateTime <= startDateTime) {
          Alert.alert('Error', 'End time must be after start time');
          setIsLoading(false);
          return;
        }

        const newShift = {
          description: shiftDescription,
          location: {
            name: shiftLocation,
            address: '',
          },
          startTime: Timestamp.fromDate(startDateTime),
          endTime: Timestamp.fromDate(endDateTime),
          status: 'active',
        };

        const shiftRef = await addShift(newShift);

        for (const member of selectedTeamMembers) {
          await assignTeamMemberToShift(shiftRef.id, member.id, member.displayName, member.role);
        }
      }

      resetShiftForm();
      setCreateShiftModalVisible(false);

      loadShifts();

      Alert.alert('Success', `${selectedDates.length} shifts created successfully`);
    } catch (error) {
      console.error('Error creating shifts:', error);
      Alert.alert('Error', 'Failed to create shifts');
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

    const [startHour, startMinute] = selectedStartTime.split(':').map(Number);
    const [endHour, endMinute] = selectedEndTime.split(':').map(Number);

    const startDateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      startHour,
      startMinute
    );

    const endDateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      endHour,
      endMinute
    );

    if (endDateTime <= startDateTime) {
      Alert.alert('Error', 'End time must be after start time');
      return;
    }

    setIsLoading(true);
    try {
      const updatedData = {
        description: shiftDescription,
        location: {
          name: shiftLocation,
          address: selectedShift.location.address || '',
        },
        startTime: Timestamp.fromDate(startDateTime),
        endTime: Timestamp.fromDate(endDateTime),
        status: 'updated',
        updatedAt: serverTimestamp(),
      };

      await updateExistingShift(selectedShift.id, updatedData);

      for (const member of selectedTeamMembers) {
        await assignTeamMemberToShift(selectedShift.id, member.id, member.displayName, member.role);
      }

      resetShiftForm();
      setEditShiftModalVisible(false);

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

    Alert.alert('Confirm Delete', 'Are you sure you want to delete this shift?', [
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
            if (selectedShift.id) {
              await deleteShift(selectedShift.id);

              resetShiftForm();
              setEditShiftModalVisible(false);
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
    ]);
  };

  const resetShiftForm = () => {
    setShiftDescription('');
    setShiftLocation('');
    setSelectedStartTime('09:00');
    setSelectedEndTime('17:00');
    setSelectedShift(null);
    setSelectedTeamMembers([]);
    setSelectedDates([]);
  };

  const handleOpenCreateShiftModal = () => {
    resetShiftForm();
    setCreateShiftModalVisible(true);
  };

  const handleOpenEditShiftModal = async (shift: Shift) => {
    setSelectedShift(shift);
    setShiftDescription(shift.description);
    setShiftLocation(shift.location.name);

    const formatTimeForPicker = (date: Date) => {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes() >= 30 ? '30' : '00';
      return `${hours}:${minutes}`;
    };

    const startDate = shift.startTime.toDate();
    const endDate = shift.endTime.toDate();

    setSelectedStartTime(formatTimeForPicker(startDate));
    setSelectedEndTime(formatTimeForPicker(endDate));

    try {
      if (shift.assignedUsers && shift.assignedUsers.length > 0) {
        const assignedMembers = [];

        for (const assignment of shift.assignedUsers) {
          const member = teamMembers.find(m => m.id === assignment.userId);
          if (member) {
            assignedMembers.push({ ...member });
          }
        }

        setSelectedTeamMembers(assignedMembers);
      } else {
        const assignments = await getShiftAssignments(shift.id || '');

        const assignedMembers = [];
        for (const assignment of assignments) {
          const member = teamMembers.find(m => m.id === assignment.userId);
          if (member) {
            assignedMembers.push({ ...member });
          }
        }

        setSelectedTeamMembers(assignedMembers);
      }
    } catch (error) {
      console.error('Error loading shift assignments:', error);
      setSelectedTeamMembers([]);
    }

    setEditShiftModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Top Navigation Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Coordinator Schedule</Text>

        <TouchableOpacity style={styles.addButton} onPress={handleOpenCreateShiftModal}>
          <Ionicons name="add-circle" size={24} color="#FF8C00" />
        </TouchableOpacity>
      </View>

      {/* Admin Badge */}
      <View style={styles.adminBadge}>
        <FontAwesome name="shield" size={12} color="#FF8C00" />
        <Text style={styles.adminBadgeText}>Coordinator View</Text>
      </View>
      {/* Calendar Container */}
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {' '}
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

                      {/* Dot indicator for days with shifts */}
                      {shifts.some(shift => {
                        const shiftDate = shift.startTime.toDate();
                        return (
                          dateObj.isCurrentMonth &&
                          parseInt(dateObj.day) === shiftDate.getDate() &&
                          selectedDate.getMonth() === shiftDate.getMonth() &&
                          selectedDate.getFullYear() === shiftDate.getFullYear()
                        );
                      }) && <View style={styles.shiftIndicator} />}
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          </View>
          {/* Shifts Section */}
          <View style={styles.shiftCard}>
            <View style={styles.shiftHeader}>
              <FontAwesome name="clock-o" size={18} color="#fff" />
              <Text style={styles.shiftHeaderText}>Manage Shifts</Text>
            </View>
            <TouchableOpacity style={styles.createShiftButton} onPress={handleOpenCreateShiftModal}>
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
                {shifts.map(shift => (
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

                    <Text style={styles.shiftLocation}>Location: {shift.location.name}</Text>

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

            <ScrollView style={styles.modalScroll}>
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

                <Text style={styles.inputLabel}>Team Members</Text>
                <View style={styles.selectedTeamMembersContainer}>
                  {selectedTeamMembers.length > 0 ? (
                    <ScrollView style={{ maxHeight: 100 }} showsHorizontalScrollIndicator={false}>
                      {selectedTeamMembers.map(member => (
                        <View key={member.id} style={styles.selectedMemberChip}>
                          <Text style={styles.selectedMemberName}>{member.displayName}</Text>
                          <TouchableOpacity
                            onPress={() => toggleTeamMemberSelection(member)}
                            style={styles.removeMemberButton}
                          >
                            <Ionicons name="close-circle" size={16} color="#fff" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>
                  ) : (
                    <Text style={styles.noMembersText}>No team members assigned</Text>
                  )}
                </View>

                <Text style={styles.inputLabel}>Available Team Members</Text>
                <ScrollView
                  horizontal
                  style={styles.teamMemberScrollView}
                  showsHorizontalScrollIndicator={false}
                >
                  {teamMembers
                    .filter(member => !selectedTeamMembers.some(m => m.id === member.id))
                    .map(member => (
                      <TouchableOpacity
                        key={member.id}
                        style={styles.teamMemberItem}
                        onPress={() => toggleTeamMemberSelection(member)}
                      >
                        <Text style={styles.teamMemberText}>{member.displayName}</Text>
                      </TouchableOpacity>
                    ))}
                </ScrollView>
                {/* Multi-Date Selection */}
                <Text style={styles.inputLabel}>Select Shift Dates</Text>
                <View style={styles.dateSelectionContainer}>
                  {calendarDays.flat().map(
                    (dateObj, index) =>
                      dateObj.isCurrentMonth && (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.dateSelectionCell,
                            selectedDates.some(date => date.getDate() === parseInt(dateObj.day)) &&
                              styles.selectedDateCell,
                          ]}
                          onPress={() => {
                            const newDate = new Date(
                              selectedDate.getFullYear(),
                              selectedDate.getMonth(),
                              parseInt(dateObj.day)
                            );

                            const isSelected = selectedDates.some(
                              date =>
                                date.getDate() === newDate.getDate() &&
                                date.getMonth() === newDate.getMonth() &&
                                date.getFullYear() === newDate.getFullYear()
                            );

                            if (isSelected) {
                              setSelectedDates(prev =>
                                prev.filter(
                                  date =>
                                    !(
                                      date.getDate() === newDate.getDate() &&
                                      date.getMonth() === newDate.getMonth() &&
                                      date.getFullYear() === newDate.getFullYear()
                                    )
                                )
                              );
                            } else {
                              setSelectedDates(prev => [...prev, newDate]);
                            }
                          }}
                        >
                          <Text style={styles.dateSelectionText}>{dateObj.day}</Text>
                        </TouchableOpacity>
                      )
                  )}
                </View>

                {/* Selected Dates Display */}
                {selectedDates.length > 0 && (
                  <View style={styles.selectedDatesContainer}>
                    <Text style={styles.inputLabel}>Selected Dates:</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={styles.selectedDatesScrollView}
                    >
                      {selectedDates.map((date, index) => (
                        <View key={index} style={styles.selectedDateChip}>
                          <Text style={styles.selectedDateText}>{date.toLocaleDateString()}</Text>
                          <TouchableOpacity
                            onPress={() => {
                              setSelectedDates(prev => prev.filter((d, i) => i !== index));
                            }}
                            style={styles.removeDateButton}
                          >
                            <Ionicons name="close-circle" size={16} color="#fff" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}

                {/* Improved Time Selection */}
                <View style={styles.timeSelectionContainer}>
                  <TimePicker
                    label="Start Time"
                    value={selectedStartTime}
                    onChange={setSelectedStartTime}
                  />

                  <TimePicker
                    label="End Time"
                    value={selectedEndTime}
                    onChange={setSelectedEndTime}
                  />
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
            </ScrollView>
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

            <ScrollView style={styles.modalScroll}>
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

                {/* Team members section */}
                <Text style={styles.inputLabel}>Assigned Team Members</Text>
                <View style={styles.selectedTeamMembersContainer}>
                  {selectedTeamMembers.length > 0 ? (
                    <ScrollView style={{ maxHeight: 100 }} showsHorizontalScrollIndicator={false}>
                      {selectedTeamMembers.map(member => (
                        <View key={member.id} style={styles.selectedMemberChip}>
                          <Text style={styles.selectedMemberName}>{member.displayName}</Text>
                          <TouchableOpacity
                            onPress={() => toggleTeamMemberSelection(member)}
                            style={styles.removeMemberButton}
                          >
                            <Ionicons name="close-circle" size={16} color="#fff" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>
                  ) : (
                    <Text style={styles.noMembersText}>No team members assigned</Text>
                  )}
                </View>

                <Text style={styles.inputLabel}>Available Team Members</Text>
                <ScrollView
                  horizontal
                  style={styles.teamMemberScrollView}
                  showsHorizontalScrollIndicator={false}
                >
                  {teamMembers
                    .filter(member => !selectedTeamMembers.some(m => m.id === member.id))
                    .map(member => (
                      <TouchableOpacity
                        key={member.id}
                        style={styles.teamMemberItem}
                        onPress={() => toggleTeamMemberSelection(member)}
                      >
                        <Text style={styles.teamMemberText}>{member.displayName}</Text>
                      </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Improved Time Selection */}
                <View style={styles.timeSelectionContainer}>
                  <TimePicker
                    label="Start Time"
                    value={selectedStartTime}
                    onChange={setSelectedStartTime}
                  />

                  <TimePicker
                    label="End Time"
                    value={selectedEndTime}
                    onChange={setSelectedEndTime}
                  />
                </View>

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
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Floating Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <FontAwesome name="home" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <FontAwesome name="calendar" size={24} color="#FF8C00" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <FontAwesome name="comments" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <FontAwesome name="map" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
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
    paddingHorizontal: 16,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 50,
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
    flexGrow: 1,
    paddingBottom: 100,
  },
  calendarCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 0,
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
    color: '#444',
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
  bottomSpacer: {
    height: 20,
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 100,
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
  modalScroll: {
    maxHeight: height * 0.65,
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
  submitButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
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
  timePickerContainer: {
    marginBottom: 16,
  },
  timeSelectionContainer: {
    marginVertical: 8,
  },
  pickerContainer: {
    borderRadius: 8,
    backgroundColor: '#222',
    marginVertical: 8,
  },
  timeOptionsContainer: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  timeOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 4,
  },
  selectedTimeOption: {
    backgroundColor: '#FF8C00',
  },
  timeText: {
    color: '#fff',
  },
  selectedTimeText: {
    color: '#000',
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
  selectedTeamMembersContainer: {
    marginBottom: 12,
    minHeight: 40,
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 8,
  },
  selectedMemberChip: {
    backgroundColor: '#333',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedMemberName: {
    color: '#fff',
    marginRight: 4,
  },
  removeMemberButton: {
    marginLeft: 4,
  },
  noMembersText: {
    color: '#888',
    fontStyle: 'italic',
    padding: 8,
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
  selectedDatesContainer: {
    marginBottom: 16,
  },
  selectedDatesScrollView: {
    maxHeight: 80,
  },
  selectedDateChip: {
    backgroundColor: '#333',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedDateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeDateButton: {
    marginLeft: 4,
  },
});

export default AdminScheduleScreen;

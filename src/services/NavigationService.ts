// src/services/NavigationService.ts

import Toast from 'react-native-toast-message';

class NavigationService {
  showToast(type = 'info', title, message) {
    Toast.show({
      type,
      text1: title,
      text2: message,
      visibilityTime: 1000,
      autoHide: true,
      position: 'bottom',
      bottomOffset: 300,
    });
  }

  // Card press handlers
  handleMessageCardPress() {
    this.showToast('info', 'Message Card', 'You pressed the message card');
  }

  handleScheduleCardPress() {
    this.showToast('info', 'Schedule Card', 'You pressed the schedule card');
  }
  
  handleLocationCardPress() {
    this.showToast('info', 'Location Card', 'You pressed the location card');
  }
  
  handleStatusCardPress() {
    this.showToast('info', 'Status Card', 'You pressed the status card');
  }

  // Navigation tab press handlers
  handleHomePress() {
    this.showToast('info', 'Home', 'You pressed the home tab');
    // No navigation needed for Home, since we're already there
  }
  
  handleSchedulePress() {
    this.showToast('success', 'Schedule', 'You pressed the Schedule tab');
    // Don't navigate since Schedule screen doesn't exist yet
  }

  handleMapPress() {
    this.showToast('info', 'Map', 'You pressed the Map tab');
    // Don't navigate since Map screen doesn't exist yet
  }

  handleMessagePress() {
    this.showToast('info', 'Message', 'You pressed the message button');
  }

  handleProfilePress() {
    this.showToast('info', 'Profile', 'You pressed the profile tab');
    // Don't navigate since Profile screen doesn't exist yet
  }

  handleNotificationsPress() {
    this.showToast('info', 'Notification', 'You pressed the notification tab');
  }
}

export default new NavigationService();

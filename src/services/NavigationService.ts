// src/services/NavigationService.tsx
import Toast from 'react-native-toast-message';

class NavigationService {

  navigation = null;

  setNavigation(navigationRef) {
    this.navigation =navigationRef;
  }

  navigate(routeName) {
    if (this.navigation) {
      this.navigation.navigate(routeName);
    } else {
      console.log('Navigation is not set');
    }
  }
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
    this.navigate('Message');
  }

  handleScheduleCardPress() {
    this.showToast('info', 'Schedule Card', 'You pressed the schedule card');
    this.navigate('Schedule');
    }
  
  
  handleLocationCardPress() {
    this.showToast('info', 'Location Card', 'You pressed the location card');
    this.navigate('Location');
    }
  
  
  handleStatusCardPress() {
    this.showToast('info', 'Status Card', 'You pressed the status card');
    this.navigate('Status');
    }
  

  // Navigation tab press handlers
  handleHomePress() {
    this.showToast('info', 'Home', 'You pressed the home tab');
    this.navigate('Home');
    }
  
  
  handleSchedulePress() {
    this.showToast('success', 'Schedule', 'You pressed the Schedule tab');
    this.navigate('Schedule');
    }
  

  handleMapPress() {
    this.showToast('info', 'Map', 'You pressed the Map tab');
    this.navigate('Map');
    }
  
  

  handleMessagePress() {
    this.showToast('info', 'Message', 'You pressed the message button');
    this.navigate('Message');
    }
  

  handleProfilePress() {
    this.showToast('info', 'Profile', 'You pressed the profile tab');
   this.navigate('Profile');
    }
  

  handleNotificationsPress() {
    this.showToast('info', 'Notification', 'You pressed the notification tab');
    this.navigate('Notification');
    }
}


export default new NavigationService();

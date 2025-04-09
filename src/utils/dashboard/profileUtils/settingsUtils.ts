// define types for settings items
export interface SettingItem {
  id: string;
  icon: string;
  title: string;
}

// get settings list
export const getSettingsItems = (): SettingItem[] => {
  return [
    { id: 'notifications', icon: 'bell', title: 'Notifications' },
    { id: 'location', icon: 'location-arrow', title: 'Location preferences' },
    { id: 'login', icon: 'sign-out', title: 'Login' },
    { id: 'accessibility', icon: 'universal-access', title: 'Accessibility' },
    { id: 'language', icon: 'globe', title: 'Language and region' },
    { id: 'darkMode', icon: 'moon-o', title: 'Dark mode' },
    { id: 'help', icon: 'question-circle', title: 'Need help?' },
    { id: 'deactivate', icon: 'trash', title: 'Deactivate account' }
  ];
};

// handle setting item actions
export const handleSettingAction = (settingId: string): void => {
  switch (settingId) {
    case 'notifications':
      console.log('Notification settings pressed');
      break;
    case 'location':
      console.log('Location settings pressed');
      break;
    case 'login':
      console.log('Login settings pressed');
      break;
    case 'accessibility':
      console.log('Accessibility settings pressed');
      break;
    case 'language':
      console.log('Language settings pressed');
      break;
    case 'darkMode':
      console.log('Dark mode settings pressed');
      break;
    case 'help':
      console.log('Help settings pressed');
      break;
    case 'deactivate':
      console.log('Deactivate account pressed');
      break;
    default:
      console.log('Unknown setting pressed');
  }
};
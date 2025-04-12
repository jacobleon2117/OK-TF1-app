// function to get active navigation item color
export const getNavItemColor = (currentScreen: string, itemName: string): string => {
  return currentScreen === itemName ? '#FF8C00' : '#fff';
};

// function to handle back navigation (can be used with the navigation from props)
export const handleBackNavigation = (navigation: any): void => {
  navigation.goBack();
};
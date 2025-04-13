export const getNavItemColor = (currentScreen: string, itemName: string): string => {
  return currentScreen === itemName ? '#FF8C00' : '#fff';
};

export const handleBackNavigation = (navigation: any): void => {
  navigation.goBack();
};

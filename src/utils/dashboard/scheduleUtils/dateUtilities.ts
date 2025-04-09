export const getMonthName = (date: Date): string => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return monthNames[date.getMonth()];
};

export const getDaysOfWeek = (): string[] => {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
};

export const isCurrentMonthView = (selectedDate: Date, today: Date): boolean => {
  return (
    selectedDate.getMonth() === today.getMonth() && 
    selectedDate.getFullYear() === today.getFullYear()
  );
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const addMonths = (date: Date, months: number): Date => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
};
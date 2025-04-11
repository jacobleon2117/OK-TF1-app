/**
 * Get the days of the week
 * @param shortForm - Whether to return short (3-letter) day names
 * @returns array of day names
 */
export const getDaysOfWeek = (shortForm: boolean = true): string[] => {
  const fullDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return shortForm ? shortDays : fullDays;
};

/**
 * Get the name of the month
 * @param date - Date object to get month name for
 * @returns string representing the month name
 */
export const getMonthName = (date: Date): string => {
  return date.toLocaleString('default', { month: 'long' });
};

/**
 * Add months to a given date
 * @param date - Original date
 * @param months - Number of months to add (can be negative)
 * @returns new Date object with months added
 */
export const addMonths = (date: Date, months: number): Date => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
};

/**
 * Format a date to a specific string representation
 * @param date - Date to format
 * @param format - Optional format string (default is 'YYYY-MM-DD')
 * @returns formatted date string
 */
export const formatDate = (date: Date, format: string = 'YYYY-MM-DD'): string => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  
  return format
    .replace('YYYY', date.getFullYear().toString())
    .replace('MM', pad(date.getMonth() + 1))
    .replace('DD', pad(date.getDate()));
};

/**
 * Check if the current view is the month containing today
 * @param selectedDate - The currently selected/viewed month
 * @param today - The current date
 * @returns boolean indicating if the selected month is the current month
 */
export const isCurrentMonthView = (selectedDate: Date, today: Date): boolean => {
  return (
    selectedDate.getMonth() === today.getMonth() &&
    selectedDate.getFullYear() === today.getFullYear()
  );
};
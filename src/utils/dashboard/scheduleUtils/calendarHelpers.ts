export interface CalendarDay {
  day: string;
  isCurrentMonth: boolean;
}

export const generateCalendarData = (date: Date): CalendarDay[][] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const totalDaysInMonth = lastDayOfMonth.getDate();
  
  const lastDayOfPrevMonth = new Date(year, month, 0).getDate();
  
  const calendarGrid: CalendarDay[][] = [];
  let dayCounter = 1;
  let nextMonthCounter = 1;
  
  for (let week = 0; week < 6; week++) {
    const weekDays: CalendarDay[] = [];
    
    for (let day = 0; day < 7; day++) {
      if (week === 0 && day < firstDayOfWeek) {
        const prevMonthDay = lastDayOfPrevMonth - (firstDayOfWeek - day - 1);
        weekDays.push({
          day: prevMonthDay.toString(),
          isCurrentMonth: false
        });
      } else if (dayCounter <= totalDaysInMonth) {
        weekDays.push({
          day: dayCounter.toString(),
          isCurrentMonth: true
        });
        dayCounter++;
      } else {
        weekDays.push({
          day: nextMonthCounter.toString(),
          isCurrentMonth: false
        });
        nextMonthCounter++;
      }
    }
    
    calendarGrid.push(weekDays);
    
    if (dayCounter > totalDaysInMonth && week >= 3 && nextMonthCounter > 7) {
      break;
    }
  }
  
  return calendarGrid;
};

export const isToday = (
  day: string, 
  isCurrentMonth: boolean, 
  selectedDate: Date, 
  today: Date
): boolean => {
  if (!isCurrentMonth) return false;
  
  return (
    parseInt(day) === today.getDate() &&
    selectedDate.getMonth() === today.getMonth() &&
    selectedDate.getFullYear() === today.getFullYear()
  );
};

export const getCurrentDayOfWeek = (date: Date = new Date()): number => {
  return date.getDay();
};
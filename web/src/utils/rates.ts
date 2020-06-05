import { isToday } from 'src/utils/date';

export const getRatesDateKey = (dateStr?: string) => {
  if (dateStr) {
    const date = new Date(dateStr);
    date.setMonth(date.getMonth() + 1);
    return isToday(date) ? 'latest' : dateStr;
  }

  return 'latest';
};

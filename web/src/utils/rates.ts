import { getFormattedDateString } from 'src/utils/date';

export const getRatesDateKey = (dateStr?: string) => {
  if (dateStr) {
    return dateStr;
  }
  
  return getFormattedDateString(new Date());
};

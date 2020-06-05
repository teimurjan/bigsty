import { getFormattedDateString } from 'src/utils/date';

export const getRatesDateKey = (dateStr?: string) => {
  const defaultKey = getFormattedDateString(new Date());
  if (dateStr) {
    return dateStr;
  }

  return defaultKey;
};

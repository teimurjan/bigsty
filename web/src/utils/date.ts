const withZero = (value: number) => (value > 9 ? value : `0${value}`);

export const getFormattedDateString = (date: Date) =>
  `${withZero(date.getDate())}.${withZero(date.getMonth())}.${date.getFullYear()}`;

export const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

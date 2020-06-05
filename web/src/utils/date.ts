const withZero = (value: number) => (value > 9 ? value : `0${value}`);

export const getFormattedDateString = (date: Date) =>
  `${withZero(date.getDate())}.${withZero(date.getMonth())}.${date.getFullYear()}`;

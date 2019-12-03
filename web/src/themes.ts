export interface ITheme {
  dark: string;
  danger: string;
  info: string;
  light: string;
  primary: string;
  success: string;
  warning: string;
}

export const defaultTheme: ITheme = {
  danger: 'hsl(348, 100%, 61%)',
  dark: 'hsl(0, 0%, 21%)',
  info: 'hsl(204, 86%,  53%)',
  light: 'hsl(0, 0%, 96%)',
  primary: 'hsl(171, 100%, 41%)',
  success: 'hsl(141, 71%,  48%)',
  warning: 'hsl(48,  100%, 67%)',
};

export interface ITheme {
  dark: string;
  danger: string;
  info: string;
  whiteTer: string;
  primary: string;
  success: string;
  warning: string;
  white: string;
  greyLight: string;
  greyLightest: string;
  grey: string;
}

export const defaultTheme: ITheme = {
  danger: 'hsl(348, 100%, 61%)',
  dark: 'hsl(0, 0%, 21%)',
  info: 'hsl(204, 86%,  53%)',
  whiteTer: 'hsl(0, 0%, 96%)',
  primary: 'hsl(171, 100%, 41%)',
  success: 'hsl(141, 71%,  48%)',
  warning: 'hsl(48,  100%, 67%)',
  white: '#fff',
  greyLight: 'hsl(0, 0%, 71%)',
  greyLightest: 'hsl(0, 0%, 93%)',
  grey: 'hsl(0, 0%, 48%)',
};

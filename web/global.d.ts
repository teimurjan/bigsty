declare interface CSSTheme {
  primary: string;
  light: string;
  white: string;
  dark: string;
  danger: string;
  greyLight: string;
  info: string;
  success: string;
  warning: string;
}

declare type Then<T> = T extends PromiseLike<infer U> ? U : T;

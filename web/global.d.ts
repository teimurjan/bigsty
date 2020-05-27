declare interface AdminUITheme {
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

declare interface ClientUITheme {
  headerBackgroundColor: string;
  borderColor: string;
  buttonDefaultColor: string;
  buttonDefaultBorderColor: string;
  buttonDefaultHoverColor: string;
  buttonDefaultBackgroundColor: string;
  buttonDefaultBackgroundHoverColor: string;
  buttonDarkColor: string;
  buttonDarkBorderColor: string;
  buttonDarkHoverColor: string;
  buttonDarkBackgroundColor: string;
  buttonDarkBackgroundHoverColor: string;
  anchorColor: string;
  backgroundPrimaryColor: string;
  backgroundSecondaryColor: string;
  textColor: string;
  textFadedColor: string;
  textSecondaryColor: string;
  primaryColor: string;
  textOnPrimaryColor: string;
  dangerColor: string;
  successColor: string;
  tooltipBackgroundColor: string;
  buttonPrimaryBackgroundHoverColor: string;
  backgroundPrimaryHoverColor: string;
}

declare type Then<T> = T extends PromiseLike<infer U> ? U : T;

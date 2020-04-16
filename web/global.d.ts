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

declare interface CSSThemeV2 {
  headerBackgroundColor: string;
  borderColor: string;
  buttonLightColor: string;
  buttonLightHoverColor: string;
  buttonLightBorderColor: string;
  buttonLightBackgroundColor: string;
  buttonLightBackgroundHoverColor: string;
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
  anchorSecondaryColor: string;
  backgroundPrimaryColor: string;
  backgroundSecondaryColor: string;
  textColor: string;
  textFadedColor: string;
  textSecondaryColor: string;
  primaryColor: string;
  textOnPrimaryColor: string;
  dangerColor: string;
}

declare type Then<T> = T extends PromiseLike<infer U> ? U : T;

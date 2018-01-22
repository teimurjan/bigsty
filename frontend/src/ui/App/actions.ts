import { updateIntl } from 'react-intl-redux';
import { Action } from '../../typings/redux-custom';

export type AppActionType =
  'APP/LOG_OUT' |
  'APP/LOG_IN';

export const LOG_OUT: AppActionType = 'APP/LOG_OUT';
export const LOG_IN: AppActionType = 'APP/LOG_IN';
export type AppAction = Action<AppActionType>;

const AVAILABLE_LOCALES: Array<string> = ['en'];

function updateLocale(locale: string) {
  const messages = require(`../../assets/translations/${locale}.json`);
  return updateIntl({locale, messages});
}

export function setupLocale() {
  let locale = localStorage.getItem('locale');
  if (!locale || AVAILABLE_LOCALES.indexOf(locale) !== -1) {
    locale = 'en';
    localStorage.setItem('locale', locale);
  }
  return updateLocale(locale);
}

export function changeLocale(locale: string) {
  if (AVAILABLE_LOCALES.indexOf(locale) !== -1) {
    localStorage.setItem('locale', locale);
  } else {
    localStorage.setItem('locale', 'en');
  }
  return updateLocale(locale);
}
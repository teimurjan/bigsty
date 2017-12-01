import {updateIntl} from 'react-intl-redux';

const AVAILABLE_LOCALES = ['en'];

function updateLocale(locale) {
  const messages = require(`../../assets/translations/${locale}.json`);
  return updateIntl({locale, messages});
}

export function setupLocale() {
  let locale = localStorage.getItem('locale');
  if (!locale || !AVAILABLE_LOCALES.includes(locale)) {
    locale = 'en';
    localStorage.setItem('locale', locale);
  }
  return updateLocale(locale)
}

export function changeLocale(locale) {
  if (AVAILABLE_LOCALES.includes(locale))
    localStorage.setItem('locale', locale);
  else
    localStorage.setItem('locale', 'en');
  return updateLocale(locale)
}
import {updateIntl} from 'react-intl-redux';

export function updateLocale(locale = 'en') {
  const messages = require(`../assets/translations/${locale}.json`);
  return (dispatch) => {
    dispatch(updateIntl({locale, messages}));
  };
}
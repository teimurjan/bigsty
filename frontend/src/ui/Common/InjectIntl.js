import React from 'react';
import {intlShape} from "react-intl";

export const InjectIntl = Component => {
  const IntlComponent = (props, context) => {
    const intl = (messageId, values = {}) => context.intl.formatMessage({id: messageId}, values);
    return <Component {...props} intl={intl} intlLocale={context.intl.locale}/>

  };
  IntlComponent.contextTypes = {
    intl: intlShape
  };
  return IntlComponent;
};
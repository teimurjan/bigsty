import * as React from 'react';
import { intlShape } from 'react-intl';

export type IntlFunction = (messageId: string, values?: {}) => string;

export interface IntlProps {
  intl: IntlFunction;
  intlLocale: string;
}

export default (Component: React.ComponentType<IntlProps>): React.StatelessComponent => {
  const IntlComponent: React.SFC = (props, context) => {
    const intl = (messageId: string, values?: {}) => context.intl.formatMessage({id: messageId}, values);
    return <Component {...props} intl={intl} intlLocale={context.intl.locale}/>;

  };
  IntlComponent.contextTypes = {
    intl: intlShape
  };
  return IntlComponent;
};
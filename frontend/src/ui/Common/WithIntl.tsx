import * as React from 'react';
import { ComponentOrStatelessComponent } from '../../types/common';
import { IntlProvider } from 'react-intl';

export default (Component: ComponentOrStatelessComponent<{}>,
                messages: {} = require(`../../assets/translations/en.json`),
                locale: 'en' = 'en'): React.SFC =>
  (props: {}, context) => (
    <IntlProvider locale={locale} messages={messages}>
      <Component {...props}/>
    </IntlProvider>
  );
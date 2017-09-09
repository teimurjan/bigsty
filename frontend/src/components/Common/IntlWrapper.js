import React from 'react';
import {intlShape} from "react-intl";

export const IntlWrapper = Component => class Intl extends React.PureComponent {
  static contextTypes = {intl: intlShape};

  intl = (messageId, values = {}) => this.context.intl.formatMessage({id: messageId}, values);

  render() {
    return <Component {...this.props} intl={this.intl}/>
  }
};
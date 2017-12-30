import * as React from 'react';
import injectIntl, { IntlProps } from '../../../Common/injectIntl';

interface MenuHeaderProps extends React.Props<{}> {
  className?: string;
}

export default injectIntl(({className, children, intl}: MenuHeaderProps & IntlProps) => (
  <li className={`nav-header ${className || ''}`}>
    <span className="block m-t-xs text-white">
      <strong className="font-bold">{children}</strong>
     </span>
    <span className="text-muted text-xs block">
      {intl('admin.layout.text.adminPanel')}
    </span>
  </li>
));
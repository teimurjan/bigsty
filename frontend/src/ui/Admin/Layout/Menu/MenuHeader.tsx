import * as React from 'react';
import { Props } from 'react';
import InjectIntl, { IntlProps } from '../../../Common/InjectIntl';

interface MenuHeaderProps extends Props<{}>, IntlProps {
  className?: string;
}

export default InjectIntl(({className, children, intl}: MenuHeaderProps) => (
  <li className={`nav-header ${className || ''}`}>
    <span className="block m-t-xs text-white">
      <strong className="font-bold">{children}</strong>
     </span>
    <span className="text-muted text-xs block">
      {intl('admin.layout.text.adminPanel')}
    </span>
  </li>
));
import * as React from 'react';
import { Props } from 'react';

interface MenuItemProps extends Props<{}> {
  active: boolean;
  className?: string;
}

export default ({active, className, children}: MenuItemProps) => (
  <li className={`${active ? 'active' : ''} ${className || ''}`}>
    {children}
  </li>
);
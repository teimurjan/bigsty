import * as React from 'react';
import { Props } from 'react';

interface MenuHeaderProps extends Props<{}> {
  className?: string;
}

export default ({className, children}: MenuHeaderProps) => (
  <li className={`nav-header ${className || ''}`}>
    {children}
  </li>
);
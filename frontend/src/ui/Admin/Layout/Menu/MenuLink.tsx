import * as React from 'react';
import { Props, ReactChild } from 'react';
import MenuItem from './MenuItem';

interface MenuLinkProps extends Props<{}> {
  to: string;
  className?: string;
}

export default ({to, children, className}: MenuLinkProps) => {
  const createLink = (child: ReactChild) => <a href={to}>{child}</a>;
  return (
    <MenuItem active={window.location.pathname === to} className={className}>
      {React.Children.map(children, createLink)}
    </MenuItem>
  );
};
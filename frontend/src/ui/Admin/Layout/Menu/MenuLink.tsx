import * as React from 'react';
import MenuItem from './MenuItem';
import Link from 'react-router/lib/Link';

interface MenuLinkProps extends React.Props<{}> {
  to: string;
  className?: string;
}

export default ({to, children, className}: MenuLinkProps) => {
  return (
    <MenuItem active={window.location.pathname === to} className={className}>
      <Link to={to}>{children}</Link>
    </MenuItem>
  );
};
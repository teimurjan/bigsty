import * as React from 'react';

import classNames from 'classnames';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const NavbarEnd = ({ children, className, ...props }: IProps) => (
  <div className={classNames('navbar-end', className)} {...props}>
    {children}
  </div>
);

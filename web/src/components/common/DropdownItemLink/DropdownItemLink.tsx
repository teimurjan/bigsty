import classNames from 'classnames';
import * as React from 'react';
import { Link, LinkProps } from 'react-router-dom';


export interface IProps extends LinkProps {
  children?: React.ReactNode;
  level?: number;
}

export const DropdownItemLink = ({ children, className, to, ...props }: IProps) => (
  <Link to={to} className={classNames('dropdown-item', className)} {...props}>
    {children}
  </Link>
);

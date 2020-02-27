import * as React from 'react';
import { Link, LinkProps } from 'react-router-dom';

import classNames from 'classnames';

export interface IProps extends LinkProps {
  color?: 'is-primary' | 'is-link' | 'is-info' | 'is-success' | 'is-warning' | 'is-danger' | 'is-dark';
  outlined?: boolean;
}

export const LinkButton = ({ children, color, className, outlined, ...props }: IProps) => (
  <Link className={classNames('button', className, color, { 'is-outlined': outlined })} {...props}>
    {children}
  </Link>
);

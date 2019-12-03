import * as React from 'react';
import { Link, LinkProps } from 'react-router-dom';

import classNames from 'classnames';

export interface IProps extends LinkProps {
  color: 'is-primary' | 'is-link' | 'is-info' | 'is-success' | 'is-warning' | 'is-danger' | 'is-dark';
}

export const LinkButton = ({ children, color, className, ...props }: IProps) => (
  <Link className={classNames('button', className, color)} {...props}>
    {children}
  </Link>
);

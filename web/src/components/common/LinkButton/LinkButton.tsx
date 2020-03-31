import classNames from 'classnames';
import Link, { LinkProps } from 'next/Link';
import * as React from 'react';

export interface IProps extends LinkProps {
  color?: 'is-primary' | 'is-link' | 'is-info' | 'is-success' | 'is-warning' | 'is-danger' | 'is-dark';
  outlined?: boolean;
  className?: string;
}

export const LinkButton: React.FC<IProps> = ({ children, color, className, outlined, ...props }) => (
  <Link {...props}>
    <button className={classNames('button', className, color, { 'is-outlined': outlined })}>{children}</button>
  </Link>
);

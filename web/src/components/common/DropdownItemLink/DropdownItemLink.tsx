import classNames from 'classnames';
import Link, { LinkProps } from 'next/link';
import * as React from 'react';

export interface IProps extends LinkProps {
  children?: React.ReactNode;
  level?: number;
  className?: string;
}

export const DropdownItemLink = ({ children, className, href, ...props }: IProps) => (
  <Link href={href} {...props}>
    <a href={href as string} className={classNames('dropdown-item', className)}>
      {children}
    </a>
  </Link>
);

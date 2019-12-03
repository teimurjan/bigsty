import * as React from 'react';

import classNames from 'classnames';

export interface IProps extends React.HTMLAttributes<HTMLLIElement> {
  children?: React.ReactNode;
  isCurrent: boolean;
}

export const PaginationLink = ({ children, className, isCurrent, ...props }: IProps) => (
  <li {...props}>
    <a className={classNames('pagination-link', { 'is-current': isCurrent })}>{children}</a>
  </li>
);

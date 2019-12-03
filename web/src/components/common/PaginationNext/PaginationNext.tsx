import * as React from 'react';

import classNames from 'classnames';

export interface IProps extends React.HTMLAttributes<HTMLAnchorElement> {
  children?: React.ReactNode;
}

export const PaginationNext = ({ children, className, ...props }: IProps) => (
  <a className={classNames('pagination-next', className)} {...props}>
    {children}
  </a>
);

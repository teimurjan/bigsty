import * as React from 'react';

import classNames from 'classnames';

export interface IProps extends React.HTMLAttributes<HTMLUListElement> {
  children?: React.ReactNode;
}

export const PaginationList = ({ children, className, ...props }: IProps) => (
  <ul className={classNames('pagination-list', className)} {...props}>
    {children}
  </ul>
);

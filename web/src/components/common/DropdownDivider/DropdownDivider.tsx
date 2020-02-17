import * as React from 'react';

import classNames from 'classnames';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const DropdownDivider = ({ children, className, ...props }: IProps) => (
  <div className={classNames('dropdown-divider', className)} {...props}>
    {children}
  </div>
);

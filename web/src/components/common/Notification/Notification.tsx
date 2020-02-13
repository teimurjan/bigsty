import * as React from 'react';

import classNames from 'classnames';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  color?: string;
}

export const Notification = ({ children, className, color, ...props }: IProps) => (
  <div className={classNames('notification', className, color)} {...props}>
    {children}
  </div>
);

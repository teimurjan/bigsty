import * as React from 'react';

import classNames from 'classnames';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Box = ({ children, className, ...props }: IProps) => (
  <div className={classNames('box', className)} {...props}>
    {children}
  </div>
);

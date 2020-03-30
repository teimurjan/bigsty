import classNames from 'classnames';
import * as React from 'react';


export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Container = ({ children, className, ...props }: IProps) => (
  <div className={classNames('container', className)} {...props}>
    {children}
  </div>
);

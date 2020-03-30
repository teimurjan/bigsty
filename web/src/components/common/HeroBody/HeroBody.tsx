import classNames from 'classnames';
import * as React from 'react';


export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const HeroBody = ({ children, className, ...props }: IProps) => (
  <div className={classNames('hero-body', className)} {...props}>
    {children}
  </div>
);

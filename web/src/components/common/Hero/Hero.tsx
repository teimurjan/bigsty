import * as React from 'react';

import classNames from 'classnames';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Hero = ({ children, className, ...props }: IProps) => (
  <div className={classNames('hero', className)} {...props}>
    {children}
  </div>
);

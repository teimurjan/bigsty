import * as React from 'react';

import classNames from 'classnames';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Section = ({ children, className, ...props }: IProps) => (
  <div className={classNames('section', className)} {...props}>
    {children}
  </div>
);

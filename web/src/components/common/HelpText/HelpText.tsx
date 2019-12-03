import * as React from 'react';

import classNames from 'classnames';

export interface IProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
  type?: 'is-danger' | 'is-success';
}

export const HelpText = ({ children, type, className, ...props }: IProps) => (
  <p className={classNames('help', className, type)} {...props}>
    {children}
  </p>
);

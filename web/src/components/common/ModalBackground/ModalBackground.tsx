import * as React from 'react';

import classNames from 'classnames';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const ModalBackground = ({ children, className, ...props }: IProps) => (
  <div className={classNames('modal-background', className)} {...props}>
    {children}
  </div>
);

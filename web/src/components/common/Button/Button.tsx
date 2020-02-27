import * as React from 'react';

import classNames from 'classnames';

export interface IProps extends React.HTMLProps<HTMLButtonElement> {
  children?: React.ReactNode;
  color?:
    | 'is-primary'
    | 'is-link'
    | 'is-info'
    | 'is-success'
    | 'is-warning'
    | 'is-danger'
    | 'is-white'
    | 'is-light'
    | 'is-dark';
  outlined?: boolean;
  loading?: boolean;
}

export const Button = ({ children, color, className, loading: isLoading = false, outlined, ...props }: IProps) => (
  <button
    className={classNames('button', className, color, {
      'is-loading': isLoading,
      'is-outlined': outlined,
    })}
    {...props}
  >
    {children}
  </button>
);

import * as React from 'react';

import classNames from 'classnames';

export interface IProps extends React.HTMLAttributes<HTMLInputElement> {
  children?: React.ReactNode;
  label?: string;
}

export const Radio = ({ className, label, ...props }: IProps) => (
  <label className={classNames('radio', className)}>
    <input type="radio" {...props} />
    {label}
  </label>
);

import classNames from 'classnames';
import * as React from 'react';


export interface IProps extends React.HTMLProps<HTMLInputElement> {
  isDanger?: boolean;
}

export const Input = ({ className, isDanger, ...props }: IProps) => (
  <input className={classNames('input', className, { 'is-danger': isDanger })} {...props} />
);

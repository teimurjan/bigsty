import * as React from 'react';
import { InputHTMLAttributes } from 'react';

export interface FormInputProps extends InputHTMLAttributes<{}> {
  email?: boolean;
  password?: boolean;
  className?: string;
}

export default ({
                  email = false, password = false, className = '', ...props
                }: FormInputProps) => {
  let type = 'text';
  if (email) {
    type = 'email';
  } else if (password) {
    type = 'password';
  }
  return <input className={`form-control ${className}`} type={type} {...props}/>;
};

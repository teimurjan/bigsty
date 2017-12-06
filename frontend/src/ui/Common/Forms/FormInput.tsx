import * as React from 'react';
import { InputHTMLAttributes } from 'react';

interface FormInputProps {
  email?: boolean;
  password?: boolean;
  className?: string;
}

const FormInput: React.SFC<FormInputProps & InputHTMLAttributes<{}>> = ({email, password, className, ...props}) => {
  let type = 'text';
  if (email) {
    type = 'email';
  } else if (password) {
    type = 'password';
  }
  return <input className={`form-control ${className}`} type={type} {...props}/>;
};

FormInput.defaultProps = {
  email: false,
  password: false,
  className: ''
};

export default FormInput;
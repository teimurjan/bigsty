import React from 'react';
import PropTypes from 'prop-types';

const FormInput = ({email, password, className, ...props}) => {
  let type = 'text';
  if (email) {
    type = 'email';
  }
  else if (password) {
    type = 'password';
  }
  return <input className={`form-control ${className}`} type={type} {...props}/>;
};

FormInput.propTypes = {
  email: PropTypes.bool.isRequired,
  password: PropTypes.bool.isRequired,
};

FormInput.defaultProps = {
  email: false,
  password: false,
  className: ''
};


export default FormInput;
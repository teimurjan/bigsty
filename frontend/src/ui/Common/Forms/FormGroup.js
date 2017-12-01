import React from 'react';
import PropTypes from 'prop-types';

const FormGroup = ({error, children, className, ...props}) => (
  <div className={`form-group ${className}${error ? ' has-error' : ''}`}>
    {children}
    {error && <small className="text-danger">{error}</small>}
  </div>
);

FormGroup.propTypes = {
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
};

FormGroup.defaultProps = {
  className: ''
};

export default FormGroup;
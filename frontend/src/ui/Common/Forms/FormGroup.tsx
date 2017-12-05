import * as React from "react";

interface FormGroupProps {
  error?: string,
  className?: string
}

const FormGroup: React.SFC<FormGroupProps> = ({error, children, className, ...props}) => (
  <div className={`form-group ${className}${error ? " has-error" : ""}`}>
    {children}
    {error && <small className="text-danger">{error}</small>}
  </div>
);

FormGroup.defaultProps = {
  className: ""
};

export default FormGroup;
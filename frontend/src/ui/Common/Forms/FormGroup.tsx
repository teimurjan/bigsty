import * as React from 'react';

export interface FormGroupProps {
  error?: string;
  className?: string;
}

export default ({error, children, className = ''}: FormGroupProps & React.Props<{}>) => (
  <div className={`form-group ${className}${error ? ' has-error' : ''}`}>
    {children}
    {error && <small className="text-danger">{error}</small>}
  </div>
);

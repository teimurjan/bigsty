import * as React from 'react';

export interface LabelProps {
  className?: string;
}

export default (({children, className = ''}: LabelProps & React.Props<{}>) => (
  <label className={`control-label ${className}`}>{children}</label>
));
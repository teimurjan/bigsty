import * as React from 'react';

export default ({type, className = ''}: { type: string, className?: string }): JSX.Element => (
  <i className={`fa fa-${type} ${className}`}/>
);
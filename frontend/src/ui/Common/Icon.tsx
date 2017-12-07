import * as React from 'react';

export default (props: { type: string, className?: '' }): JSX.Element => (
  <i className={`fa fa-${props.type} ${props.className || ''}`}/>
);
import * as React from 'react';

export type ComponentOrStatelessComponent<Props> = React.ComponentClass<Props> | React.StatelessComponent<Props>;

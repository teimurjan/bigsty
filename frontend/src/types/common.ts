import * as React from 'react';

export type ComponentOrStatelessComponent<Props> = React.ComponentClass<Props> | React.StatelessComponent<Props>;

export interface DataPayload {
  data: object | Array<object>;
}

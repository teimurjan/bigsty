import * as React from 'react';

export interface ReactPropsWithClass<T = {}> extends React.Props<T> {
  className?: string;
}
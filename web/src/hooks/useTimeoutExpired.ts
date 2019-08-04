import * as React from "react";

export const useTimeoutExpired = (
  delay: number = 100 // milliseconds
) => {
  const [isTimeoutExpired, setTimeoutExpired] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setTimeoutExpired(true), delay);

    return () => clearTimeout(t);
  }, []);

  return isTimeoutExpired;
};

export interface IInjectedProp {
  isTimeoutExpired: boolean;
}

export const withTimeoutExpired = <T>(
  Component:
    | React.ComponentClass<T & IInjectedProp>
    | React.SFC<T & IInjectedProp>,
  delay: number = 100
): React.SFC<T> => props => {
  const isTimeoutExpired = useTimeoutExpired(delay);

  return React.createElement(Component, { ...{ ...props, isTimeoutExpired } });
};

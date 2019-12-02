import * as React from "react";
import { useBoolean } from "src/hooks/useBoolean";

export interface IContextValue {
  appState: {
    isLoading: boolean;
    setIdle: () => void;
    setLoading: () => void;
  };
}

const { Provider, Consumer } = React.createContext<IContextValue | null>(null);

interface IProviderProps {
  children: React.ReactNode;
}

export const AppStateProvider: React.FC<IProviderProps> = ({ children }) => {
  const {
    value: isLoading,
    setPositive: setLoading,
    setNegative: setIdle
  } = useBoolean();

  return (
    <Provider
      value={{
        appState: {
          isLoading,
          setIdle,
          setLoading
        }
      }}
    >
      {children}
    </Provider>
  );
};

export const injectAppState = (
  Component:
    | React.ComponentClass<IContextValue>
    | React.StatelessComponent<IContextValue>
): React.SFC<any> => props => (
  <Consumer>
    {(context: IContextValue) => <Component {...{ ...props, ...context }} />}
  </Consumer>
);

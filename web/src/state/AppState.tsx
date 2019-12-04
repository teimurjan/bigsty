import * as React from 'react';

import { useBoolean } from 'src/hooks/useBoolean';

export interface IContextValue {
  appState: {
    isLoading: boolean;
    setIdle: () => void;
    setLoading: () => void;
  };
}

const Context = React.createContext<IContextValue | null>(null);

interface IProviderProps {
  children: React.ReactNode;
}

export const AppStateProvider: React.FC<IProviderProps> = ({ children }) => {
  const { value: isLoading, setPositive: setLoading, setNegative: setIdle } = useBoolean();

  return (
    <Context.Provider
      value={{
        appState: {
          isLoading,
          setIdle,
          setLoading,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAppState = () => React.useContext(Context) as IContextValue;

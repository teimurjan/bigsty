import * as React from 'react';
import { useDebounce } from 'src/hooks/useDebounce';

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
  const [isLoading, setLoading] = React.useState(true);

  const isLoadingDebounced = useDebounce(isLoading, 1000);

  const setLoading_ = React.useCallback(() => setLoading(true), []);
  const setIdle = React.useCallback(() => setLoading(false), []);

  return (
    <Context.Provider
      value={{
        appState: {
          isLoading: isLoadingDebounced,
          setIdle,
          setLoading: setLoading_,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAppState = () => React.useContext(Context) as IContextValue;

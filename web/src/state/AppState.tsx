import * as React from 'react';

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
  const [loadingRequestsCount, setLoadingRequestsCount] = React.useState(0);

  const setLoading = React.useCallback(() => {
    setLoadingRequestsCount(loadingRequestsCount + 1);
  }, [loadingRequestsCount]);
  const setIdle = React.useCallback(() => {
    setLoadingRequestsCount(Math.max(loadingRequestsCount - 1, 0));
  }, [loadingRequestsCount]);

  return (
    <Context.Provider
      value={{
        appState: {
          isLoading: loadingRequestsCount > 0,
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

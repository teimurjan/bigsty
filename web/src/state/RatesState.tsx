import * as React from 'react';

import { useDependencies } from 'src/DI/DI';
import { getRatesDateKey } from 'src/utils/rates';

interface IRates {
  [key: string]: {
    kgsToUsd?: number;
  };
}

export interface IContextValue {
  ratesState: {
    rates: IRates;
    isLoading: boolean;
    error?: string;
    fetchRates: (date?: string) => Promise<void>;
  };
}

const Context = React.createContext<IContextValue | null>(null);

interface IProviderProps {
  children: React.ReactNode;
}

const datesToFetch = new Set<string | undefined>();
export const RatesStateProvider: React.SFC<IProviderProps> = ({ children }) => {
  const {
    dependencies: {
      storages: { stateCache: stateCacheStorage },
      APIs: { rates: ratesAPI },
    },
  } = useDependencies();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [rates, setRates] = React.useState<IRates>(stateCacheStorage.get('rates') || {});


  const fetchRates = async (date?: string) => {
    if (datesToFetch.has(date)) {
      return
    }

    datesToFetch.add(date);

    setLoading(true);
    try {
      const { data } = await ratesAPI.getAll(date);
      const rates_ = { ...stateCacheStorage.get('rates'), [getRatesDateKey(date)]: { kgsToUsd: data.KGS_USD } };
      setRates(rates_);
      stateCacheStorage.set('rates', rates_, { expireIn: 60 * 60 });
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Context.Provider
      value={{
        ratesState: {
          rates,
          isLoading,
          error,
          fetchRates,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useRatesState = () => React.useContext(Context) as IContextValue;

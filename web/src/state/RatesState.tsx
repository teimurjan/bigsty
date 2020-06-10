import * as React from 'react';

import { useDependencies } from 'src/DI/DI';
import { getFormattedDateString } from 'src/utils/date';
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
export const fixedRateDateStr = getFormattedDateString(new Date(2020, 6, 6));
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
    const date_ = fixedRateDateStr ? fixedRateDateStr : date;
    if (datesToFetch.has(date_)) {
      return;
    }
    datesToFetch.add(date_);

    setLoading(true);
    try {
      const { data } = await ratesAPI.getAll(date_);
      const rates_ = { ...stateCacheStorage.get('rates'), [getRatesDateKey(date_)]: { kgsToUsd: data.kgs_to_usd } };
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

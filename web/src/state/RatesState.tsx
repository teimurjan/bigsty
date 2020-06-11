import * as React from 'react';

import { useDependencies } from 'src/DI/DI';
import { ICachedRates } from 'src/services/RatesService';
import { getFormattedDateString } from 'src/utils/date';

export interface IContextValue {
  ratesState: {
    rates: ICachedRates;
    isLoading: boolean;
    error?: string;
    fetchRates: (date?: string) => Promise<void>;
  };
}

const Context = React.createContext<IContextValue | null>(null);

interface IProviderProps {
  children: React.ReactNode;
  initialProps?: {
    rates: ICachedRates;
    error?: string;
  };
}

const datesToFetch = new Set<string | undefined>();
export const fixedRateDateStr = getFormattedDateString(new Date(2020, 6, 6));
export const RatesStateProvider: React.SFC<IProviderProps> = ({ initialProps, children }) => {
  const {
    dependencies: {
      services: { rates: ratesService },
    },
  } = useDependencies();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(initialProps ? initialProps.error : undefined);
  const [rates, setRates] = React.useState(initialProps ? initialProps.rates : ratesService.getAllCached());

  const fetchRates = async (date?: string) => {
    const date_ = fixedRateDateStr ? fixedRateDateStr : date;
    if (datesToFetch.has(date_)) {
      return;
    }
    datesToFetch.add(date_);

    setLoading(true);
    try {
      await ratesService.getOne(date_);
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

  React.useEffect(() => {
    return ratesService.addChangeListener((_, rates) => setRates(rates as ICachedRates));
  }, [ratesService]);

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

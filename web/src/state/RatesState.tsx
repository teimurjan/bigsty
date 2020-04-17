import axios from 'axios';
import * as React from 'react';

import { useDependencies } from 'src/DI/DI';

const nodeValueToFloat = (node: Element) => parseFloat(node.textContent ? node.textContent.replace(',', '.') : '');

const getValuteNode = (valuteNodes: Element[], code: string) =>
  valuteNodes.find(valute => {
    const charCode = valute.querySelector('CharCode');
    return charCode ? charCode.textContent === code : false;
  });

const getExchangeRate = (valuteNode: Element | undefined) => {
  if (valuteNode) {
    const valuteValueNode = valuteNode.querySelector('Value');
    const valuteNominalNode = valuteNode.querySelector('Nominal');
    if (valuteValueNode && valuteValueNode.textContent && valuteNominalNode && valuteNominalNode.textContent) {
      const rate = nodeValueToFloat(valuteValueNode) / nodeValueToFloat(valuteNominalNode);
      return Number.isNaN(rate) ? undefined : rate;
    }
  }

  return undefined;
};

interface IRates {
  usdToKgs?: number;
}

export interface IContextValue {
  ratesState: {
    rates: IRates;
    isLoading: boolean;
  };
}

const Context = React.createContext<IContextValue | null>(null);

interface IProviderProps {
  children: React.ReactNode;
}

export const RatesStateProvider: React.SFC<IProviderProps> = ({ children }) => {
  const [isLoading, setLoading] = React.useState(false);
  const {
    dependencies: {
      storages: { stateCache: stateCacheStorage },
    },
  } = useDependencies();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [rates, setRates] = React.useState<IRates>(stateCacheStorage.get('rates') || {});

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await axios.get('https://cors-anywhere.herokuapp.com/http://www.cbr.ru/scripts/XML_daily.asp');

        const xml = new DOMParser().parseFromString(res.data, 'application/xml');
        const valutes = Array.from(xml.querySelectorAll('Valute'));
        const kgsValute = getValuteNode(valutes, 'KGS');
        const usdValute = getValuteNode(valutes, 'USD');
        const rubToKgsRate = getExchangeRate(kgsValute);
        const rubToUsdRate = getExchangeRate(usdValute);
        if (rubToUsdRate && rubToKgsRate) {
          const delta = 5;
          const usdToKgsRate = rubToUsdRate / rubToKgsRate + delta;

          const rates_ = { usdToKgs: usdToKgsRate };
          setRates(rates_);
          stateCacheStorage.set('rates', rates_);
        }
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Context.Provider value={{ ratesState: { rates, isLoading } }}>{children}</Context.Provider>;
};

export const useRatesState = () => React.useContext(Context) as IContextValue;

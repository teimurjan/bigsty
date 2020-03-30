import * as React from 'react';
import { defineMessages, IntlProvider as ReactIntlProvider } from 'react-intl';

import { IIntlListResponseItem } from 'src/api/IntlAPI.js';
import defaultMessages from 'src/assets/translations/ru-RU.json';
import { useDependencies } from 'src/DI/DI';
import { DEFAULT_LOCALE } from 'src/services/IntlService';
import { useAppState } from 'src/state/AppState';

export interface IContextValue {
  intlState: {
    locale: string;
    changeLocale: (locale: string) => void;
    availableLocales: IIntlListResponseItem[];
  };
}

const Context = React.createContext<IContextValue | null>(null);

interface IProviderProps {
  children: React.ReactNode;
}

const pluralRuleFunctionOf = {
  'en-US': (n: number, isOrdinal: boolean) => {
    if (isOrdinal) {
      if (n === 1) {
        return 'first';
      }
      if (n === 2) {
        return 'second';
      }
      if (n === 3) {
        return 'third';
      }
      return `${n}th`;
    }

    if (n === 0) {
      return 'zero';
    }
    if (n === 1) {
      return 'one';
    }
    if (n === 2) {
      return 'two';
    }
    if (n < 10) {
      return 'few';
    }
    return 'many';
  },
  'ru-RU': (n: number, isOrdinal: boolean) => {
    if (isOrdinal) {
      return `${n}-й`;
    }

    if (n === 0) {
      return 'ноль';
    }
    if (n === 1) {
      return 'один';
    }
    if (n === 2) {
      return 'два';
    }
    if (n < 10) {
      return 'несколько';
    }
    return 'много';
  },
};

export const IntlStateProvider: React.SFC<IProviderProps> = ({ children }) => {
  const {
    dependencies: {
      services: { intl: service },
    },
  } = useDependencies();

  const {
    appState: { setLoading, setIdle },
  } = useAppState();

  const [availableLocales, setAvailableLocales] = React.useState<IIntlListResponseItem[]>([]);
  const [locale, setLocale] = React.useState<string>(DEFAULT_LOCALE);
  const [messages, setMessages] = React.useState<{ [key: string]: string }>(defaultMessages);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isInitialized, setInitialized] = React.useState(false);

  const changeLocale = React.useCallback(
    async (locale: string) => {
      setLoading();
      const messages = await import(`../assets/translations/${locale}.json`);
      defineMessages({
        locale,
        pluralRuleFunction: pluralRuleFunctionOf[locale],
      });
      service.setLocale(locale);
      setIdle();
      setMessages(messages);
      setLocale(locale);
    },
    [service, setIdle, setLoading],
  );

  const fetchAvailableLocales = React.useCallback(async () => {
    setLoading();
    try {
      const locales = await service.getAvailableLocales();
      setAvailableLocales(locales);
    } catch (e) {
      setError(e);
    } finally {
      setIdle();
    }
  }, [service, setIdle, setLoading]);

  React.useEffect(() => {
    if (isInitialized) {
      return;
    }

    const savedLocale = service.getLocale();
    if (savedLocale !== locale) {
      changeLocale(savedLocale);
    }
    fetchAvailableLocales();
    setInitialized(true);
  }, [changeLocale, fetchAvailableLocales, isInitialized, locale, service]);

  return (
    <Context.Provider value={{ intlState: { locale, changeLocale, availableLocales } }}>
      <ReactIntlProvider locale={locale} messages={messages}>
        {children}
      </ReactIntlProvider>
    </Context.Provider>
  );
};

export const useIntlState = () => React.useContext(Context) as IContextValue;

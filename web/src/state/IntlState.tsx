import * as React from 'react';

import { addLocaleData, IntlProvider as ReactIntlProvider } from 'react-intl';

import { IIntlListResponseItem } from 'src/api/IntlAPI.js';
import defaultMessages from 'src/assets/translations/en-US.json';
import { injectDependencies } from 'src/DI/DI';
import { IIntlService } from 'src/services/IntlService';

import { IContextValue as AppStateContextValue, injectAppState } from './AppState';

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
  service: IIntlService;
}

interface IProviderState {
  locale: string;
  messages: { [key: string]: string };
  availableLocales: IIntlListResponseItem[];
  error?: string;
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

class Provider extends React.Component<IProviderProps & AppStateContextValue, IProviderState> {
  public state = {
    availableLocales: [],
    locale: 'en-US',
    messages: defaultMessages,
  };

  public componentDidMount() {
    const { service } = this.props;
    const { locale } = this.state;
    const savedLocale = service.getLocale();
    if (savedLocale !== locale) {
      this.changeLocale(savedLocale);
    }
    this.getAvailableLocales();
  }

  public render() {
    const { changeLocale } = this;
    const { children } = this.props;
    const { locale, messages, availableLocales } = this.state;

    return (
      <Context.Provider value={{ intlState: { locale, changeLocale, availableLocales } }}>
        <ReactIntlProvider locale={locale} messages={messages}>
          {children}
        </ReactIntlProvider>
      </Context.Provider>
    );
  }

  private changeLocale = async (locale: string) => {
    const { appState, service } = this.props;
    appState.setLoading();
    const messages = await import(`../assets/translations/${locale}.json`);
    addLocaleData({
      locale,
      pluralRuleFunction: pluralRuleFunctionOf[locale],
    });
    service.setLocale(locale);
    appState.setIdle();
    this.setState({ messages, locale });
  };

  private getAvailableLocales = async () => {
    const { appState, service } = this.props;
    appState.setLoading();
    try {
      const locales = await service.getAvailableLocales();
      this.setState({ availableLocales: locales });
    } catch (e) {
      this.setState({ error: e });
    }
    appState.setIdle();
  };
}

const ProviderWithAppState = injectAppState(Provider);

export const IntlStateProvider = injectDependencies(({ dependencies, ...props }) => (
  <ProviderWithAppState {...props} service={dependencies.services.intl} />
));

export const injectIntlState = (
  Component: React.ComponentClass<IContextValue> | React.SFC<IContextValue>,
): React.SFC<any> => (props: any) => (
  <Context.Consumer>{(value: IContextValue) => <Component {...{ ...props, ...value }} />}</Context.Consumer>
);

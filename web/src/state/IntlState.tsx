import * as React from "react";
import { addLocaleData, IntlProvider as ReactIntlProvider } from "react-intl";
import defaultMessages from "../assets/translations/en-US.json";
import {
  IContextValue as AppStateContextValue,
  injectAppState
} from "./AppState";

export interface IContextValue {
  intl: {
    locale: string;
    changeLocale: (locale: string) => void;
  };
}

const { Provider, Consumer } = React.createContext<IContextValue | null>(null);

interface IProviderProps {
  children: React.ReactNode;
}

interface IProviderState {
  locale: string;
  messages: { [key: string]: string };
}

const pluralRuleFunctionOf = {
  "en-US": (n: number, isOrdinal: boolean) => {
    if (isOrdinal) {
      if (n === 1) {
        return "first";
      }
      if (n === 2) {
        return "second";
      }
      if (n === 3) {
        return "third";
      }
      return `${n}th`;
    }

    if (n === 0) {
      return "zero";
    }
    if (n === 1) {
      return "one";
    }
    if (n === 2) {
      return "two";
    }
    if (n < 10) {
      return "few";
    }
    return "many";
  },
  "ru-RU": (n: number, isOrdinal: boolean) => {
    if (isOrdinal) {
      return `${n}-й`;
    }

    if (n === 0) {
      return "ноль";
    }
    if (n === 1) {
      return "один";
    }
    if (n === 2) {
      return "два";
    }
    if (n < 10) {
      return "несколько";
    }
    return "много";
  }
};

export const IntlStateProvider = injectAppState(
  class extends React.Component<
    IProviderProps & AppStateContextValue,
    IProviderState
  > {
    public state = {
      locale: "en-US",
      messages: defaultMessages
    };

    public componentDidMount() {
      this.changeLocale("ru-RU");
    }

    public render() {
      const { changeLocale } = this;
      const { children } = this.props;
      const { locale, messages } = this.state;

      return (
        <Provider value={{ intl: { locale, changeLocale } }}>
          <ReactIntlProvider locale={locale} messages={messages}>
            {children}
          </ReactIntlProvider>
        </Provider>
      );
    }

    private changeLocale = async (locale: string) => {
      const { app } = this.props;
      app.setLoading();
      const messages = await import(`../assets/translations/${locale}.json`);
      addLocaleData({
        locale,
        pluralRuleFunction: pluralRuleFunctionOf[locale]
      });
      app.setIdle();
      this.setState({ messages, locale });
    };
  }
);

export const injectIntlState = (
  Component: React.ComponentClass<IContextValue>
): React.ComponentClass<any> =>
  class extends React.Component<any> {
    public render() {
      return (
        <Consumer>
          {(value: IContextValue) => (
            <Component {...{ ...this.props, ...value }} />
          )}
        </Consumer>
      );
    }
  };

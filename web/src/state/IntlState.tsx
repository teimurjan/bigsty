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

export const IntlStateProvider = injectAppState(
  class extends React.Component<
    IProviderProps & AppStateContextValue,
    IProviderState
  > {
    public state = {
      locale: "en-US",
      messages: defaultMessages
    };

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
      addLocaleData({ locale });
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

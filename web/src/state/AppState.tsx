import * as React from "react";

export interface IContextValue {
  appState: {
    isLoading: boolean;
    setIdle: () => void;
    setLoading: () => void;
  };
}

const { Provider, Consumer } = React.createContext<IContextValue | null>(null);

interface IProviderProps {
  children: React.ReactNode;
}

interface IProviderState {
  isLoading: boolean;
}

export class AppStateProvider extends React.Component<
  IProviderProps,
  IProviderState
> {
  public state = {
    isLoading: false
  };

  public render() {
    const { setIdle, setLoading } = this;
    const { isLoading } = this.state;
    const { children } = this.props;
    return (
      <Provider
        value={{
          appState: {
            isLoading,
            setIdle,
            setLoading
          }
        }}
      >
        {children}
      </Provider>
    );
  }

  private setLoading = () => this.setState({ isLoading: true });
  private setIdle = () => this.setState({ isLoading: false });
}

export const injectAppState = (
  Component:
    | React.ComponentClass<IContextValue>
    | React.StatelessComponent<IContextValue>
): React.ComponentClass<any> =>
  class extends React.Component<any> {
    public render() {
      return (
        <Consumer>
          {(context: IContextValue) => (
            <Component {...{ ...this.props, ...context }} />
          )}
        </Consumer>
      );
    }
  };

import * as jwtDecode from "jwt-decode";
import * as React from "react";
import { injectDependencies } from "src/DI/DI";
import { IAuthService } from "src/services/AuthService";

export interface IUser {
  id: number;
  name: string;
}

export interface IContextValue {
  userState: {
    clearUser: () => void;
    syncUser: () => void;
    user: IUser | null;
  };
}

const Context = React.createContext<IContextValue | null>(null);

interface IProviderProps {
  children?: React.ReactNode;
  service: IAuthService;
}

interface IProviderState {
  user: IUser | null;
}

class Provider extends React.Component<IProviderProps, IProviderState> {
  public state = {
    user: null
  };

  public componentDidMount() {
    this.syncUser();
  }

  public render() {
    const { clearUser, syncUser } = this;
    const { user } = this.state;
    const { children } = this.props;
    return (
      <Context.Provider
        value={{
          userState: {
            clearUser,
            syncUser,
            user
          }
        }}
      >
        {children}
      </Context.Provider>
    );
  }

  private setUser = (user: IUser | null) => this.setState({ user });

  private syncUser = () => {
    const { service } = this.props;
    const accessToken = service.getAccessToken();
    if (accessToken) {
      this.setUser(jwtDecode(accessToken));
    }
  };

  private clearUser = () => {
    const { service } = this.props;
    service.logOut();
    this.setUser(null);
  };
}

export const UserStateProvider = injectDependencies(
  ({ dependencies, ...props }) => (
    <Provider {...props} service={dependencies.services.auth} />
  )
);

export const injectUserState = (
  Component: React.ComponentClass<IContextValue> | React.SFC<IContextValue>
): React.SFC<any> => props => (
  <Context.Consumer>
    {(context: IContextValue) => <Component {...{ ...props, ...context }} />}
  </Context.Consumer>
);

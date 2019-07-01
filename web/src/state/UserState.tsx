import * as jwtDecode from "jwt-decode";
import * as React from "react";
import { injectDependencies } from "src/DI/DI";
import { IAuthService } from "src/services/AuthService";

export type User =
  | {
      id: number;
      name: string;
      group: string;
    }
  | null
  | {};

export interface IContextValue {
  userState: {
    clearUser: () => void;
    syncUser: () => void;
    user: User;
  };
}

const Context = React.createContext<IContextValue | null>(null);

interface IProviderProps {
  children?: React.ReactNode;
  service: IAuthService;
}

interface IProviderState {
  user: User;
}

const USER_NOT_SET_STATE = null;
const USER_ANONYMOUSE_STATE = null;

class Provider extends React.Component<IProviderProps, IProviderState> {
  public state = {
    user: USER_NOT_SET_STATE
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

  private setUser = (user: User) => this.setState({ user });

  private syncUser = () => {
    const { service } = this.props;
    const accessToken = service.getAccessToken();
    this.setUser(accessToken ? jwtDecode(accessToken) : USER_ANONYMOUSE_STATE);
  };

  private clearUser = () => {
    const { service } = this.props;
    service.logOut();
    this.setUser(USER_ANONYMOUSE_STATE);
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

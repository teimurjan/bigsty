import * as React from 'react';

import * as jwtDecode from 'jwt-decode';

import { useDependencies } from 'src/DI/DI';

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
}

const USER_NOT_SET_STATE = null;
const USER_ANONYMOUSE_STATE = {};

export const UserStateProvider: React.SFC<IProviderProps> = ({ children }) => {
  const {
    dependencies: {
      services: { auth: service },
    },
  } = useDependencies();

  const [user, setUser] = React.useState<User>(USER_NOT_SET_STATE);

  const syncUser = React.useCallback(() => {
    const accessToken = service.getAccessToken();
    setUser(accessToken ? jwtDecode(accessToken) : USER_ANONYMOUSE_STATE);
  }, [service]);

  const clearUser = React.useCallback(() => {
    service.logOut();
    setUser(USER_ANONYMOUSE_STATE);
  }, [service]);

  return (
    <Context.Provider
      value={{
        userState: {
          clearUser,
          syncUser,
          user,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useUserState = () => React.useContext(Context) as IContextValue;

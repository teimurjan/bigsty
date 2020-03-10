import * as React from 'react';

import * as jwtDecode from 'jwt-decode';

import { useDependencies } from 'src/DI/DI';

export type AuthorizedUser = {
  id: number;
  name: string;
  email: string;
  group: string;
};

export type EmptyUser = null;

export type AnonymousUser = {};

export type User = AuthorizedUser | EmptyUser | AnonymousUser;

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
const USER_ANONYMOUS_STATE = {};

export const UserStateProvider: React.SFC<IProviderProps> = ({ children }) => {
  const {
    dependencies: {
      services: { auth: service },
      APIs: { client },
    },
  } = useDependencies();

  const [user, setUser] = React.useState<User>(USER_NOT_SET_STATE);

  const syncUser = React.useCallback(() => {
    const accessToken = service.getAccessToken();
    setUser(accessToken ? jwtDecode(accessToken) : USER_ANONYMOUS_STATE);
  }, [service]);

  const clearUser = React.useCallback(() => {
    service.logOut();
    setUser(USER_ANONYMOUS_STATE);
  }, [service]);

  React.useEffect(() => {
    const interceptor = client.interceptors.response.use(undefined, error => {
      if (error.response.status === 401) {
        clearUser();
      }

      return error;
    });

    return () => client.interceptors.response.eject(interceptor);
  }, [clearUser, client.interceptors.request, client.interceptors.response]);

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

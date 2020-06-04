import { User, AuthorizedUser } from 'src/state/UserState';

export const isUserAdmin = (user: User) => !!user && 'group' in user && user.group === 'admin';

export const isUserNotSetYet = (user: User) => user === null;

export const isUserAnonymous = (user: User) => !!user && Object.keys(user).length === 0;

export const isUserAuthorized = (user: User) => !isUserNotSetYet(user) && !isUserAnonymous(user);

export const getUserPropertySafe = (user: User, property: keyof AuthorizedUser, defaultValue?: string) => {
  if (isUserAuthorized(user)) {
    return (user as AuthorizedUser)[property];
  }

  return defaultValue;
};

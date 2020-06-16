import { User, AuthorizedUser } from 'src/state/UserState';

export const isUserAdmin = (user: User) => !!user && 'group' in user && user.group === 'admin';

export const isUserManager = (user: User) => !!user && 'group' in user && user.group === 'manager';

export const isUserAdminOrManager = (user: User) => [isUserAdmin, isUserManager].some(f => f(user));

export const isUserNotSetYet = (user: User) => user === null;

export const isUserAnonymous = (user: User) => !!user && Object.keys(user).length === 0;

export const isUserAuthorized = (user: User) => !isUserNotSetYet(user) && !isUserAnonymous(user);

export const getUserPropertySafe = (user: User, property: keyof AuthorizedUser, defaultValue?: string) => {
  if (isUserAuthorized(user)) {
    return (user as AuthorizedUser)[property];
  }

  return defaultValue;
};

export const basicAdminShowRule = (user: User) => !isUserNotSetYet(user) && isUserAdminOrManager(user);
export const basicAdminRedirectRule = (user: User) => !isUserNotSetYet(user) && !isUserAdminOrManager(user);

export const fullAdminShowRule = (user: User) => !isUserNotSetYet(user) && isUserAdmin(user);
export const fullAdminRedirectRule = (user: User) => !isUserNotSetYet(user) && !isUserAdmin(user);

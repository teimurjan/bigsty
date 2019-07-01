import { User } from "src/state/UserState";

export const isUserAdmin = (user: User) =>
  user && "group" in user && user.group === "admin";

export const isUserNotSetYet = (user: User) => user === null;

export const isUserAnonymous = (user: User) =>
  user && Object.keys(user).length === 0;

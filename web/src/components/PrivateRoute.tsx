import * as React from "react";

import { Redirect, Route } from "react-router";

import { isUserAdmin, isUserNotSetYet } from "src/helpers/user";

import {
  IContextValue as UserStateContextValue,
  injectUserState,
  User
} from "src/state/UserState";

interface IGetRendererArgs<P> {
  Component: React.ComponentClass<P> | React.SFC<P>;
  user: User;
}

const getComponentRenderer = <P extends object>({
  Component,
  user
}: IGetRendererArgs<P>) => (props: P) =>
  isUserNotSetYet(user) || isUserAdmin(user) ? (
    <Component {...props} />
  ) : (
    <Redirect to="/" />
  );

interface IProps {
  component: React.ComponentClass<any> | React.SFC<any>;
}

export const PrivateRoute = injectUserState(
  ({
    component: Component,
    userState,
    ...rest
  }: IProps & UserStateContextValue) => (
    <Route
      {...rest}
      render={getComponentRenderer({
        Component,
        user: userState.user
      })}
    />
  )
);

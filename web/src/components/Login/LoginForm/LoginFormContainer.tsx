import * as React from "react";
import { injectIntl } from "react-intl";
import { withRouter } from "react-router";
import { injectDependencies } from "src/DI/DI";
import { injectUserState } from "src/state/UserState";
import { IProps, LoginFormPresenter } from "./LoginFormPresenter";
import { LoginFormView } from "./LoginFormView";

const ConnectedLoginFormPresenter = injectUserState(
  withRouter<IProps>(LoginFormPresenter)
);

export const LoginFormContainer = injectDependencies(({ dependencies }) => (
  <ConnectedLoginFormPresenter
    authService={dependencies.services.auth}
    View={injectIntl(LoginFormView)}
  />
));

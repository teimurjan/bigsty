import * as React from "react";
import { injectIntl } from "react-intl";
import { withRouter } from "react-router";
import { injectDependencies } from "src/DI/DI";
import { IProps, LoginFormPresenter } from "./LoginFormPresenter";
import { LoginFormView } from "./LoginFormView";

const ConnectedLoginFormPresenter = withRouter<IProps>(LoginFormPresenter);

export const LoginFormContainer = injectDependencies(({ dependencies }) => (
  <ConnectedLoginFormPresenter
    service={dependencies.services.auth}
    View={injectIntl(LoginFormView)}
  />
));

import * as React from "react";
import { injectIntl } from "react-intl";
import { withRouter } from "react-router";
import { IProps, LoginPagePresenter } from "./LoginPagePresenter";
import { LoginPageView } from "./LoginPageView";

const ConnectedLoginPagePresenter = withRouter<IProps>(LoginPagePresenter);

export const LoginPageContainer = () => (
  <ConnectedLoginPagePresenter View={injectIntl(LoginPageView)} />
);

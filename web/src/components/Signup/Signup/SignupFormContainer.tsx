import * as React from "react";
import { injectIntl } from "react-intl";
import { withRouter } from "react-router";
import { injectDependencies } from "src/DI/DI";
import { IProps, SignupFormPresenter } from "./SignupFormPresenter";
import { SignupFormView } from "./SignupFormView";

const ConnectedSignupFormPresenter = withRouter<IProps>(SignupFormPresenter);

export const SignupFormContainer = injectDependencies(({ dependencies }) => (
  <ConnectedSignupFormPresenter
    service={dependencies.services.auth}
    View={injectIntl(SignupFormView)}
  />
));

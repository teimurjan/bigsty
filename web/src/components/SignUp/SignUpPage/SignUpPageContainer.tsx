import * as React from "react";
import { injectIntl } from "react-intl";
import { withRouter } from "react-router";
import { IProps, SignUpPagePresenter } from "./SignUpPagePresenter";
import { SignUpPageView } from "./SignUpPageView";

const ConnectedSignUpPagePresenter = withRouter<IProps>(SignUpPagePresenter);

export const SignUpPageContainer = () => (
  <ConnectedSignUpPagePresenter View={injectIntl(SignUpPageView)} />
);

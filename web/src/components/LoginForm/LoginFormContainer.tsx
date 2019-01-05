import * as React from "react";
import { injectDependencies } from "src/DI/DI";
import LoginFormPresenter from "./LoginFormPresenter";
import LoginFormView from "./LoginFormView";

export const LoginFormContainer = injectDependencies(({ dependencies }) => (
  <LoginFormPresenter
    service={dependencies.services.auth}
    view={LoginFormView}
  />
));

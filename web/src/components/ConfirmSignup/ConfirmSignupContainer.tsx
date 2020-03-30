import * as React from 'react';
import { useHistory } from 'react-router';


import { ConfirmSignupPresenter } from 'src/components/ConfirmSignup/ConfirmSignupPresenter';
import { ConfirmSignupView } from 'src/components/ConfirmSignup/ConfirmSignupView';
import { useDependencies } from 'src/DI/DI';

export const ConfirmSignupContainer = () => {
  const { dependencies } = useDependencies();
  const history = useHistory();

  return <ConfirmSignupPresenter history={history} View={ConfirmSignupView} service={dependencies.services.auth} />;
};

import * as React from 'react';
import { useHistory } from 'react-router';

import { useDependencies } from 'src/DI/DI';

import { ConfirmSignupPresenter } from './ConfirmSignupPresenter';
import { ConfirmSignupView } from './ConfirmSignupView';

export const ConfirmSignupContainer = () => {
  const { dependencies } = useDependencies();
  const history = useHistory();

  return <ConfirmSignupPresenter history={history} View={ConfirmSignupView} service={dependencies.services.auth} />;
};

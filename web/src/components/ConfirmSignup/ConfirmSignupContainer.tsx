import * as React from 'react';

import { useDependencies } from 'src/DI/DI';

import { ConfirmSignupPresenter } from './ConfirmSignupPresenter';
import { ConfirmSignupView } from './ConfirmSignupView';
import { useHistory } from 'react-router';

export const ConfirmSignupContainer = () => {
  const { dependencies } = useDependencies();
  const history = useHistory();

  return <ConfirmSignupPresenter history={history} View={ConfirmSignupView} service={dependencies.services.auth} />;
};

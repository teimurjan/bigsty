import * as React from 'react';
import { injectIntl } from 'react-intl';
import { useHistory } from 'react-router';

import { LoginFormPresenter } from 'src/components/Login/LoginForm/LoginFormPresenter';
import { LoginFormView } from 'src/components/Login/LoginForm/LoginFormView';
import { useDependencies } from 'src/DI/DI';
import { useUserState } from 'src/state/UserState';


export const LoginFormContainer = () => {
  const history = useHistory();

  const { dependencies } = useDependencies();
  const { userState } = useUserState();

  return (
    <LoginFormPresenter
      View={injectIntl(LoginFormView)}
      service={dependencies.services.auth}
      userState={userState}
      history={history}
    />
  );
};

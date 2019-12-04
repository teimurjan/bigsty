import * as React from 'react';

import { injectIntl } from 'react-intl';
import { useHistory } from 'react-router';

import { useDependencies } from 'src/DI/DI';
import { useUserState } from 'src/state/UserState';

import { LoginFormPresenter } from './LoginFormPresenter';
import { LoginFormView } from './LoginFormView';

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

import * as React from 'react';

import { injectIntl } from 'react-intl';

import { useDependencies } from 'src/DI/DI';
import { useUserState } from 'src/state/UserState';

import { SignUpFormPresenter } from './SignUpFormPresenter';
import { SignUpFormView } from './SignUpFormView';
import { useHistory } from 'react-router';

export const SignUpFormContainer = () => {
  const history = useHistory();

  const { dependencies } = useDependencies();
  const { userState } = useUserState();

  return (
    <SignUpFormPresenter
      history={history}
      userState={userState}
      service={dependencies.services.auth}
      View={injectIntl(SignUpFormView)}
    />
  );
};

import * as React from 'react';
import { injectIntl } from 'react-intl';
import { useHistory } from 'react-router';

import { useDependencies } from 'src/DI/DI';

import { SignUpFormPresenter } from './SignUpFormPresenter';
import { SignUpFormView } from './SignUpFormView';

export const SignUpFormContainer = () => {
  const history = useHistory();

  const { dependencies } = useDependencies();

  return (
    <SignUpFormPresenter history={history} service={dependencies.services.auth} View={injectIntl(SignUpFormView)} />
  );
};

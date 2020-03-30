import * as React from 'react';
import { injectIntl } from 'react-intl';
import { useHistory } from 'react-router';


import { SignUpFormPresenter } from 'src/components/SignUp/SignUpForm/SignUpFormPresenter';
import { SignUpFormView } from 'src/components/SignUp/SignUpForm/SignUpFormView';
import { useDependencies } from 'src/DI/DI';

export const SignUpFormContainer = () => {
  const history = useHistory();

  const { dependencies } = useDependencies();

  return (
    <SignUpFormPresenter history={history} service={dependencies.services.auth} View={injectIntl(SignUpFormView)} />
  );
};

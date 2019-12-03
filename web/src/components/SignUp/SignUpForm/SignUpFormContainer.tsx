import * as React from 'react';

import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router';

import { injectDependencies } from 'src/DI/DI';
import { injectUserState } from 'src/state/UserState';

import { IProps, SignUpFormPresenter } from './SignUpFormPresenter';
import { SignUpFormView } from './SignUpFormView';

const ConnectedSignUpFormPresenter = injectUserState(withRouter<IProps>(SignUpFormPresenter));

export const SignUpFormContainer = injectDependencies(({ dependencies }) => (
  <ConnectedSignUpFormPresenter service={dependencies.services.auth} View={injectIntl(SignUpFormView)} />
));

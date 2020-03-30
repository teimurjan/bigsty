import * as React from 'react';
import { injectIntl } from 'react-intl';
import { useHistory, useRouteMatch } from 'react-router';

import { SignUpPagePresenter } from './SignUpPagePresenter';
import { SignUpPageView } from './SignUpPageView';

export const SignUpPageContainer = () => {
  const history = useHistory();
  const match = useRouteMatch();

  return <SignUpPagePresenter history={history} match={match} View={injectIntl(SignUpPageView)} />;
};

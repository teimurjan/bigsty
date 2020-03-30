import * as React from 'react';
import { injectIntl } from 'react-intl';
import { useHistory, useRouteMatch } from 'react-router';

import { LoginPagePresenter } from './LoginPagePresenter';
import { LoginPageView } from './LoginPageView';

export const LoginPageContainer = () => {
  const history = useHistory();
  const match = useRouteMatch();

  return <LoginPagePresenter history={history} match={match} View={injectIntl(LoginPageView)} />;
};

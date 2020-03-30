import * as React from 'react';
import { injectIntl } from 'react-intl';

import { useAppState } from 'src/state/AppState';
import { useUserState } from 'src/state/UserState';

import { AdminHeaderPresenter } from './AdminHeaderPresenter';
import { AdminHeaderView } from './AdminHeaderView';

export const AdminHeaderContainer = () => {
  const { appState } = useAppState();
  const { userState } = useUserState();

  return <AdminHeaderPresenter View={injectIntl(AdminHeaderView)} appState={appState} userState={userState} />;
};

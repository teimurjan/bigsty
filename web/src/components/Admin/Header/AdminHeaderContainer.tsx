import * as React from 'react';
import { injectIntl } from 'react-intl';

import { AdminHeaderPresenter } from 'src/components/Admin/Header/AdminHeaderPresenter';
import { AdminHeaderView } from 'src/components/Admin/Header/AdminHeaderView';
import { useAppState } from 'src/state/AppState';
import { useUserState } from 'src/state/UserState';

export const AdminHeaderContainer = () => {
  const { appState } = useAppState();
  const { userState } = useUserState();

  return <AdminHeaderPresenter View={injectIntl(AdminHeaderView)} appState={appState} userState={userState} />;
};

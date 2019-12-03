import * as React from 'react';

import { IContextValue as AppStateContextValue } from 'src/state/AppState';
import { IContextValue as UserStateContextValue } from 'src/state/UserState';

export interface IProps extends UserStateContextValue, AppStateContextValue {
  View: React.ComponentClass<IViewProps>;
}

export interface IViewProps {
  onLogOutClick: () => void;
}

export const AdminHeaderPresenter = ({ userState, View }: IProps) => {
  const onLogoutClick = React.useCallback(() => {
    userState.clearUser();
  }, [userState]);

  return <View onLogOutClick={onLogoutClick} />;
};

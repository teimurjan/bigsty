import * as React from 'react';

import { IContextValue as UserStateContextValue } from 'src/state/UserState';

export interface IProps extends UserStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
}

export interface IViewProps {
  onLogOutClick: () => void;
}

export const AdminMenuPresenter = ({ userState, View }: IProps) => {
  const onLogoutClick = React.useCallback(() => {
    userState.clearUser();
  }, [userState]);

  return <View onLogOutClick={onLogoutClick} />;
};

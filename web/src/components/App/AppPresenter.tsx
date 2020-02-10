import * as React from 'react';
import { IContextValue as AppStateContextValue } from 'src/state/AppState';
import { useUserState } from 'src/state/UserState';

interface IProps extends AppStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
}

export interface IViewProps {
  isLoading: boolean;
}

export const AppPresenter = ({ View, appState: { isLoading } }: IProps) => {
  const {
    userState: { syncUser },
  } = useUserState();

  React.useEffect(() => {
    syncUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <View isLoading={isLoading} />;
};

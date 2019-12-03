import * as React from 'react';
import { IContextValue as AppStateContextValue } from 'src/state/AppState';

interface IProps extends AppStateContextValue {
  View: React.ComponentClass<IViewProps>;
}

export interface IViewProps {
  isLoading: boolean;
}

export const AppPresenter = ({ View, appState: { isLoading } }: IProps) => <View isLoading={isLoading} />;

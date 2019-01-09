import * as React from "react";
import { IContextValue as AppStateContextValue } from "src/state/AppState";

interface IProps extends AppStateContextValue {
  View: React.ComponentClass<IViewProps>;
}

export interface IViewProps {
  isLoading: boolean;
}

export class AppPresenter extends React.Component<IProps> {
  public render() {
    const {
      View,
      appState: { isLoading }
    } = this.props;
    return <View isLoading={isLoading} />;
  }
}

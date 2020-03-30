import { History } from 'history';
import * as React from 'react';
import { match } from 'react-router';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  match: match | null;
  history: History;
}

export interface IViewProps {
  isOpen: boolean;
  onClose: () => void;
}

export class LoginPagePresenter extends React.Component<IProps> {
  public render() {
    const { View, match } = this.props;
    return <View isOpen={match ? match.isExact : false} onClose={this.close} />;
  }

  private close = () => {
    const { history } = this.props;
    history.replace('/');
  };
}

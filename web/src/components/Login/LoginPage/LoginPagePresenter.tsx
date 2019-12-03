import * as React from 'react';
import { RouteComponentProps } from 'react-router';

export interface IProps extends RouteComponentProps<any> {
  View: React.ComponentClass<IViewProps>;
}

export interface IViewProps {
  isOpen: boolean;
  onClose: () => void;
}

export class LoginPagePresenter extends React.Component<IProps> {
  public render() {
    const { View, match } = this.props;
    return <View isOpen={match.isExact} onClose={this.close} />;
  }

  private close = () => {
    const { history } = this.props;
    history.replace('/');
  };
}

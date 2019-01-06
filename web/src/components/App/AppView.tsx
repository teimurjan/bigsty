import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { PageLoader } from "../common/PageLoader/PageLoader";
import { LoginPage } from "../LoginPage/LoginPage";
import { NotFound } from "../NotFound";

interface IProps {
  isLoading: boolean;
}

export class AppView extends React.Component<IProps> {
  public render() {
    const { isLoading } = this.props;
    if (isLoading) {
      return <PageLoader isActive={true} />;
    }
    return (
      <Router>
        <Switch>
          <Route exact={true} path="/login" component={LoginPage} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    );
  }
}

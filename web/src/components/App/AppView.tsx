import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { PageLoader } from "../common/PageLoader/PageLoader";
import { LoginPageContainer } from "../Login/LoginPage/LoginPageContainer";
import { NotFound } from "../NotFound";
import { SignupPageContainer } from "../Signup/SignupPage/SignupPageContainer";

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
          <Route exact={true} path="/login" component={LoginPageContainer} />
          <Route exact={true} path="/signup" component={SignupPageContainer} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    );
  }
}

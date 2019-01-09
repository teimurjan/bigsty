import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { PageLoader } from "../common/PageLoader/PageLoader";
import { LoginPageContainer } from "../Login/LoginPage/LoginPageContainer";
import { MainPage } from "../MainPage";
import { NotFoundContainer } from "../NotFound/NotFoundContainer";
import { SignupPageContainer } from "../Signup/SignupPage/SignupPageContainer";

interface IProps {
  isLoading: boolean;
}

export class AppView extends React.Component<IProps> {
  public render() {
    const { isLoading } = this.props;
    return (
      <React.Fragment>
        <Router>
          <Switch>
            <Route exact={true} path="/login" component={LoginPageContainer} />
            <Route
              exact={true}
              path="/signup"
              component={SignupPageContainer}
            />
            <Route exact={true} path="/" component={MainPage} />
            <Route component={NotFoundContainer} />
          </Switch>
        </Router>
        <PageLoader isActive={isLoading} />
      </React.Fragment>
    );
  }
}

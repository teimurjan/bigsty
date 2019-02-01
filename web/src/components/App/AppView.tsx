import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { PageLoader } from "../common/PageLoader/PageLoader";
import { LoginPageContainer } from "../Login/LoginPage/LoginPageContainer";
import { MainPage } from "../MainPage";
import { NotFoundContainer } from "../NotFound/NotFoundContainer";
import { SignUpPageContainer } from "../SignUp/SignUpPage/SignUpPageContainer";

interface IProps {
  isLoading: boolean;
}

export class AppView extends React.Component<IProps> {
  public render() {
    const { isLoading } = this.props;
    return (
      <React.Fragment>
        <Router>
          <React.Fragment>
            <Route exact={true} path="/login" component={LoginPageContainer} />
            <Route
              exact={true}
              path="/signup"
              component={SignUpPageContainer}
            />
            <Switch>
              <Route path="/" component={MainPage} />
              <Route component={NotFoundContainer} />
            </Switch>
          </React.Fragment>
        </Router>
        <PageLoader isActive={isLoading} />
      </React.Fragment>
    );
  }
}

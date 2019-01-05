import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { LoginFormContainer } from "./LoginForm/LoginFormContainer";
import { NotFound } from "./NotFound";

export class App extends React.Component<{}> {
  public render() {
    return (
      <Router>
        <Switch>
          <Route exact={true} path="/login" component={LoginFormContainer} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    );
  }
}

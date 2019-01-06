import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {
  IContextValue as AppStateContextValue,
  injectAppState
} from "src/state/AppState";
import { LoginPage } from "./LoginPage/LoginPage";
import { NotFound } from "./NotFound";

export const App = injectAppState(
  class extends React.Component<AppStateContextValue> {
    public render() {
      const {
        app: { isLoading }
      } = this.props;
      if (isLoading) {
        return <p>Loading</p>;
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
);

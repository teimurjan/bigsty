import * as React from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { Admin } from "src/components/Admin/Admin";
import { PageLoader } from "src/components/common/PageLoader/PageLoader";
import { HeaderContainer } from "src/components/Header/HeaderContainer";
import { LoginPageContainer } from "src/components/Login/LoginPage/LoginPageContainer";
import { NotFoundContainer } from "src/components/NotFound/NotFoundContainer";
import { PrivateRoute } from "src/components/PrivateRoute";
import { ProductTypesPageContainer } from "src/components/ProductType/ProducTypesPage/ProductTypesPageContainer";
import { SignUpPageContainer } from "src/components/SignUp/SignUpPage/SignUpPageContainer";

interface IProps {
  isLoading: boolean;
}

export const AppView = ({ isLoading }: IProps) => (
  <>
    <Router>
      <>
        <HeaderContainer />
        <Route exact={true} path="/login" component={LoginPageContainer} />
        <Route exact={true} path="/signup" component={SignUpPageContainer} />
        <Switch>
          <Route
            exact={true}
            path="/categories/:categoryId/productTypes"
            component={ProductTypesPageContainer}
          />
          <PrivateRoute exact={true} path="/admin" component={Admin} />

          <Route component={NotFoundContainer} />
        </Switch>
      </>
    </Router>
    <PageLoader isActive={isLoading} />
  </>
);

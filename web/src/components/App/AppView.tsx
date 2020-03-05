import * as React from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Admin } from 'src/components/Admin/Admin';
import { PageLoader } from 'src/components/common/PageLoader/PageLoader';
import { PrivateRoute } from 'src/components/PrivateRoute';
import { Client } from 'src/components/Client/Client';
import { Global, css } from '@emotion/core';

interface IProps {
  isLoading: boolean;
}

export const AppView = ({ isLoading }: IProps) => (
  <>
    <Global
      styles={css`
        @import url('https://fonts.googleapis.com/css?family=Oswald:300,400,500,700&display=swap');

        body,
        button,
        input,
        select,
        textarea {
          font-family: 'Oswald', sans-serif;
        }

        html {
          overflow: auto;
        }

        .button {
          border-radius: 0 !important;
        }
      `}
    />
    <Router>
      <Switch>
        <PrivateRoute path="/admin" component={Admin} />

        <Route component={Client} />
      </Switch>
    </Router>
    <PageLoader isActive={isLoading} />
  </>
);

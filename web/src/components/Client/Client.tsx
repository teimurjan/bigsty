/** @jsx jsx */
import * as React from 'react';
import { css, jsx } from '@emotion/core';

import { Route, Switch } from 'react-router-dom';

import { HeaderContainer } from 'src/components/Client/Header/HeaderContainer';
import { LoginPageContainer } from 'src/components/Login/LoginPage/LoginPageContainer';
import { NotFoundContainer } from 'src/components/NotFound/NotFoundContainer';
import { ProductTypesPageContainer } from 'src/components/Client/ProducTypesPage/ProductTypesPageContainer';
import { SignUpPageContainer } from 'src/components/SignUp/SignUpPage/SignUpPageContainer';
import { Container } from '../common/Container/Container';
import { NavContainer } from './Nav/NavContainer';
import { flexMixin } from 'src/styles/mixins';
import { Section } from '../common/Section/Section';
import { ProductTypePageContainer } from './ProductTypePage/ProductTypePageContainer';

export const Client = () => (
  <React.Fragment>
    <HeaderContainer />
    <Route exact={true} path="/login" component={LoginPageContainer} />
    <Route exact={true} path="/signup" component={SignUpPageContainer} />
    <Section>
      <Container>
        <div
          css={css`
            ${flexMixin};
          `}
        >
          <NavContainer />
          <div
            css={css`
              flex: 1;
            `}
          >
            <Switch>
              <Route exact={true} path="/categories/:categoryId/productTypes" component={ProductTypesPageContainer} />
              <Route exact={true} path="/productTypes/:id" component={ProductTypePageContainer} />

              <Route component={NotFoundContainer} />
            </Switch>
          </div>
        </div>
      </Container>
    </Section>
  </React.Fragment>
);

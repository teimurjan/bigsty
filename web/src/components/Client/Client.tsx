/** @jsx jsx */
import * as React from 'react';

import { css, jsx } from '@emotion/core';
import { Route, Switch } from 'react-router-dom';

import { HeaderContainer } from 'src/components/Client/Header/HeaderContainer';
import { LoginPageContainer } from 'src/components/Login/LoginPage/LoginPageContainer';
import { NotFoundContainer } from 'src/components/NotFound/NotFoundContainer';
import { ProductTypesPageContainer } from 'src/components/Client/ProducTypesPage/ProductTypesPageContainer';
import { SignUpPageContainer } from 'src/components/SignUp/SignUpPage/SignUpPageContainer';

import { flexMixin } from 'src/styles/mixins';
import { mediaQueries } from 'src/styles/media';

import { Container } from '../common/Container/Container';

import { NavContainer } from './Nav/NavContainer';
import { ProductTypePageContainer } from './ProductTypePage/ProductTypePageContainer';
import { HomeContainer } from './Home/HomeContainer';
import { CartContainer } from './Cart/CartContainer';
import { FooterView } from './Footer/FooterView';

export const Client = () => (
  <React.Fragment>
    <HeaderContainer />
    <Route exact={true} path="/login" component={LoginPageContainer} />
    <Route exact={true} path="/signup" component={SignUpPageContainer} />
    <Container
      css={css`
        @media ${mediaQueries.maxWidth768} {
          margin: 0 0.5rem;
        }
      `}
    >
      <div
        css={css`
          padding-top: 80px;
          min-height: calc(100vh - 120px);
          ${flexMixin};
        `}
      >
        <NavContainer />
        <div
          css={css`
            width: 100%;
          `}
        >
          <Switch>
            <Route exact={true} path="/categories/:categoryId/products" component={ProductTypesPageContainer} />
            <Route exact={true} path="/products/:id" component={ProductTypePageContainer} />
            <Route path="/" component={HomeContainer} />

            <Route component={NotFoundContainer} />
          </Switch>
        </div>
      </div>
      <CartContainer />
    </Container>
    <FooterView />
  </React.Fragment>
);

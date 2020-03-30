/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { CartContainer } from 'src/components/Client/Cart/CartContainer';
import { FooterView } from 'src/components/Client/Footer/FooterView';
import { HeaderContainer } from 'src/components/Client/Header/HeaderContainer';
import { HomeContainer } from 'src/components/Client/Home/HomeContainer';
import { NavContainer } from 'src/components/Client/Nav/NavContainer';
import { ProductTypePageContainer } from 'src/components/Client/ProductTypePage/ProductTypePageContainer';
import { ProductTypesPageContainer } from 'src/components/Client/ProducTypesPage/ProductTypesPageContainer';
import { Container } from 'src/components/common/Container/Container';
import { LoginPageContainer } from 'src/components/Login/LoginPage/LoginPageContainer';
import { NotFoundContainer } from 'src/components/NotFound/NotFoundContainer';
import { SignUpPageContainer } from 'src/components/SignUp/SignUpPage/SignUpPageContainer';
import { useMedia } from 'src/hooks/useMedia';
import { mediaQueries } from 'src/styles/media';
import { flexMixin } from 'src/styles/mixins';




export const Client = () => {
  const isMobile = useMedia([mediaQueries.maxWidth768], [true], false);

  const navNode = <NavContainer />;

  return (
    <React.Fragment>
      <HeaderContainer nav={isMobile ? navNode : null} cart={<CartContainer />} />
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
            padding-top: 100px;
            min-height: calc(100vh - 130px);
            ${flexMixin};
          `}
        >
          {!isMobile && navNode}
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
      </Container>
      <FooterView />
    </React.Fragment>
  );
};

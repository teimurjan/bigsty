/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import * as React from 'react';

import { CartContainer } from 'src/components/Client/Cart/CartContainer';
import { FooterView } from 'src/components/Client/Footer/FooterView';
import { HeaderContainer } from 'src/components/Client/Header/HeaderContainer';
import { NavContainer } from 'src/components/Client/Nav/NavContainer';
import { Container } from 'src/components/common/Container/Container';
import { useMedia } from 'src/hooks/useMedia';
import { mediaQueries } from 'src/styles/media';
import { flexMixin } from 'src/styles/mixins';

export const Layout: React.FC = ({ children }) => {
  const isMobile = useMedia([mediaQueries.maxWidth768], [true], false);

  const nav = <NavContainer />;

  return (
    <React.Fragment>
      <HeaderContainer nav={isMobile ? nav : null} cart={<CartContainer />} />
      <Container
        css={css`
          @media ${mediaQueries.maxWidth768} {
            margin: 0 0.5rem !important;
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
          {!isMobile && nav}
          <div
            css={css`
              width: 100%;
            `}
          >
            {children}
          </div>
        </div>
      </Container>
      <FooterView />
    </React.Fragment>
  );
};

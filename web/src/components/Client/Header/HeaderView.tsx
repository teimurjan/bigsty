/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Link from 'next/link';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { IViewProps as IProps } from 'src/components/Client/Header/HeaderPresenter';
import { SearchContainer } from 'src/components/Client/Search/SearchContainer';
import { UserDropdownContainer as UserDropdown } from 'src/components/Client/UserDropdown/UserDropdownContainer';
import { Container } from 'src/components/common/Container/Container';
import { Navbar } from 'src/components/common/Navbar/Navbar';
import { NavbarBrand } from 'src/components/common/NavbarBrand/NavbarBrand';
import { NavbarBurger } from 'src/components/common/NavbarBurger/NavbarBurger';
import { NavbarEnd } from 'src/components/common/NavbarEnd/NavbarEnd';
import { NavbarItem } from 'src/components/common/NavbarItem/NavbarItem';
import { NavbarMenu } from 'src/components/common/NavbarMenu/NavbarMenu';
import { NavbarStart } from 'src/components/common/NavbarStart/NavbarStart';
import { useWindowScroll } from 'src/hooks/useWindowScroll';
import { mediaQueries } from 'src/styles/media';
import { withPublicURL } from 'src/utils/url';

export const HeaderView = ({ user, onLogOutClick, nav, cart }: IProps) => {
  const intl = useIntl();

  const [isOpen, setOpen] = React.useState(false);

  const toggleOpen = () => setOpen(!isOpen);

  const { y } = useWindowScroll();

  return (
    <Navbar
      className={y !== 0 ? 'has-shadow' : undefined}
      css={css`
        height: 70px;
        position: fixed !important;
        top: 0;
        left: 0;
        width: 100%;

        @media ${mediaQueries.maxWidth768} {
          height: 50px;
          margin-bottom: 5px;
        }
      `}
    >
      <Container>
        <div
          css={css`
            display: flex;
            justify-content: space-between;
            width: 100%;
          `}
        >
          <Link href="/">
            <a href="/" className="navbar-item">
              <img
                alt={intl.formatMessage({ id: 'common.logo' })}
                css={css`
                  max-height: 4.5rem !important;
                  padding-top: 1rem;

                  @media ${mediaQueries.maxWidth768} {
                    max-height: 2.5rem !important;
                    padding-top: 0;
                  }
                `}
                src={withPublicURL('icon/android-chrome-192x192.png')}
              />
            </a>
          </Link>
          <div
            css={css`
              display: flex;
              justify-content: center;
              align-items: center;

              @media ${mediaQueries.maxWidth768} {
                margin-right: 20px;

                & > * {
                  margin-left: 5px;
                }
              }
            `}
          >
            <SearchContainer />
            <UserDropdown />
            {cart}
          </div>
        </div>
      </Container>
    </Navbar>
  );
};

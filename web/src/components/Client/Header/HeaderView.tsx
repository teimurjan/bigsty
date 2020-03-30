/** @jsx jsx */

import { css, jsx } from '@emotion/core';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import logo from 'src/assets/images/logo.png';
import { Button } from 'src/components/common/Button/Button';
import { Container } from 'src/components/common/Container/Container';
import { LinkButton } from 'src/components/common/LinkButton/LinkButton';
import { Navbar } from 'src/components/common/Navbar/Navbar';
import { NavbarBrand } from 'src/components/common/NavbarBrand/NavbarBrand';
import { NavbarBurger } from 'src/components/common/NavbarBurger/NavbarBurger';
import { NavbarEnd } from 'src/components/common/NavbarEnd/NavbarEnd';
import { NavbarItem } from 'src/components/common/NavbarItem/NavbarItem';
import { NavbarMenu } from 'src/components/common/NavbarMenu/NavbarMenu';
import { NavbarStart } from 'src/components/common/NavbarStart/NavbarStart';
import { isUserAdmin, isUserAnonymous, isUserNotSetYet } from 'src/helpers/user';
import { useWindowScroll } from 'src/hooks/useWindowScroll';
import { mediaQueries } from 'src/styles/media';

import { LanguageDropdownContainer as LanguageDropdown } from '../LanguageDropdown/LanguageDropdownContainer';
import { SearchContainer } from '../Search/SearchContainer';

import { IViewProps as IProps } from './HeaderPresenter';

const buttonsCSS = css`
  margin: 0.25rem 1rem 0 1rem !important;
  @media ${mediaQueries.maxWidth768} {
    margin: 0 auto 0 auto !important;
  }
`;

export const HeaderView = ({ user, onLogOutClick, nav, cart }: IProps) => {
  const intl = useIntl();

  const [isOpen, setOpen] = React.useState(false);

  const toggleOpen = () => setOpen(!isOpen);

  const { y } = useWindowScroll();

  return (
    <Navbar
      className={y !== 0 ? 'has-shadow' : undefined}
      css={css`
        height: 80px;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
      `}
    >
      <Container>
        <NavbarBrand>
          <Link className="navbar-item" to="/">
            <img
              alt={intl.formatMessage({ id: 'common.logo' })}
              css={css`
                max-height: 4.5rem !important;
                padding-top: 1rem;

                @media ${mediaQueries.maxWidth768} {
                  max-height: 3rem !important;
                  padding-top: 0;
                }
              `}
              src={logo}
            />
          </Link>
          <NavbarBurger isActive={isOpen} onClick={toggleOpen} />
        </NavbarBrand>
        <NavbarMenu isActive={isOpen}>
          <NavbarStart>
            <NavbarItem>
              <SearchContainer />
            </NavbarItem>
          </NavbarStart>
          <NavbarEnd>
            <NavbarItem onClick={toggleOpen}>{nav}</NavbarItem>
            <NavbarItem>
              <div
                css={css`
                  display: flex;
                  align-items: center;
                `}
              >
                <LanguageDropdown />

                {isUserAnonymous(user) || isUserNotSetYet(user) ? (
                  <div css={buttonsCSS} className="buttons">
                    <LinkButton outlined to="/login">
                      {intl.formatMessage({ id: 'Header.logIn' })}
                    </LinkButton>
                    <LinkButton outlined to="/signup">
                      {intl.formatMessage({ id: 'Header.signUp' })}
                    </LinkButton>
                  </div>
                ) : (
                  <div css={buttonsCSS} className="buttons">
                    <Button onClick={onLogOutClick} outlined>
                      {intl.formatMessage({ id: 'Header.logOut' })}
                    </Button>
                    {isUserAdmin(user) && (
                      <LinkButton outlined to="/admin">
                        {intl.formatMessage({ id: 'Header.admin' })}
                      </LinkButton>
                    )}
                  </div>
                )}

                {cart}
              </div>
            </NavbarItem>
          </NavbarEnd>
        </NavbarMenu>
      </Container>
    </Navbar>
  );
};

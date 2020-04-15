/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from 'emotion-theming';
import Link from 'next/link';
import { useIntl } from 'react-intl';

import { IViewProps as IProps } from 'src/components/Client/Header/HeaderPresenter';
import { SearchContainer } from 'src/components/Client/Search/SearchContainer';
import { UserDropdownContainer as UserDropdown } from 'src/components/Client/UserDropdown/UserDropdownContainer';
import { Container } from 'src/components/common/Container/Container';
import { Drawer } from 'src/components/common/Drawer/Drawer';
import { IconLink } from 'src/components/common/IconLink/IconLink';
import { Navbar } from 'src/components/common/Navbar/Navbar';
import { useBoolean } from 'src/hooks/useBoolean';
import { useWindowScroll } from 'src/hooks/useWindowScroll';
import { mediaQueries } from 'src/styles/media';
import { withPublicURL } from 'src/utils/url';

export const HeaderView = ({ user, onLogOutClick, nav, cart }: IProps) => {
  const intl = useIntl();
  const theme = useTheme<CSSTheme>();

  const { value: isOpen, setPositive: open, setNegative: close } = useBoolean();

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
          height: 100px;
          margin-bottom: 5px;
        }
      `}
    >
      <Container>
        <button
          onClick={open}
          css={css`
            padding: 0px 15px 10px 10px !important;
            outline: none;
            font-size: 14px;
            font-weight: bold;
            display: none;
            border: none;
            background: transparent;
            text-decoration: underline;

            @media ${mediaQueries.maxWidth768} {
              display: inline-block;
            }
          `}
        >
          {intl.formatMessage({ id: 'common.menu' })}{' '}
          <IconLink
            size="sm"
            css={css`
              display: inline-block;
              transition: transform 300ms ease-in-out;
              transform: rotateZ(${isOpen ? 180 : 0}deg);
              transition-delay: 0.3s;
            `}
            icon={faCaretRight}
          />
        </button>
        <Drawer isOpen={isOpen} fromSide="left" close={close} backdrop>
          <div
            css={css`
              background: ${theme.white};
              padding: 20px 10px 0 10px;
              width: 70vw;
              height: 100%;
            `}
          >
            {nav}
          </div>
        </Drawer>
        <div
          css={css`
            display: flex;
            justify-content: space-between;
            width: 100%;
          `}
        >
          <Link href="/">
            <a
              css={css`
                background: transparent !important;
              `}
              href="/"
              className="navbar-item"
            >
              <img
                alt={intl.formatMessage({ id: 'common.logo' })}
                css={css`
                  max-height: 3.5rem !important;
                  padding-top: 10px;

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

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { NextRouter } from 'next/router';
import { useIntl } from 'react-intl';

import { IViewProps as IProps } from 'src/components/Client/Nav/NavPresenter';
import { Menu } from 'src/components/common/Menu/Menu';
import { NavLink } from 'src/components/common/NavLink/NavLink';
import { mediaQueries } from 'src/styles/media';

export const NavView = ({ categories, router }: IProps & { router: NextRouter }) => {
  const intl = useIntl();

  return (
    <Menu
      css={css`
        width: 250px;
        padding: 0 1.5rem;

        @media ${mediaQueries.maxWidth768} {
          width: 100%;
          padding: 0;
        }
      `}
    >
      <Menu.List>
        <Menu.Item>
          <NavLink active={router.asPath === '/'} href="/">
            {intl.formatMessage({ id: 'AdminMenu.home' })}
          </NavLink>
        </Menu.Item>
      </Menu.List>
      <Menu.Label>{intl.formatMessage({ id: 'Nav.categories.title' })}</Menu.Label>
      <Menu.List>
        {categories.map(category => {
          const href = `/categories/${category.id}/products`;
          return (
            <Menu.Item key={category.id}>
              <NavLink active={router.asPath === href} href={href}>
                {category.name}
              </NavLink>
            </Menu.Item>
          );
        })}
      </Menu.List>
    </Menu>
  );
};

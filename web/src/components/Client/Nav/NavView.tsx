/** @jsx jsx */

import { css, jsx } from '@emotion/core';
import { IntlShape } from 'react-intl';

import { IViewProps as IProps } from 'src/components/Client/Nav/NavPresenter';
import { Menu } from 'src/components/common/Menu/Menu';
import { NavLink } from 'src/components/common/NavLink/NavLink';
import { mediaQueries } from 'src/styles/media';

export const NavView = ({ intl, categories }: IProps & { intl: IntlShape }) => {
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
          <NavLink href="/">
            {intl.formatMessage({ id: 'AdminMenu.home' })}
          </NavLink>
        </Menu.Item>
      </Menu.List>
      <Menu.Label>{intl.formatMessage({ id: 'Nav.categories.title' })}</Menu.Label>
      <Menu.List>
        {categories.map(category => (
          <Menu.Item key={category.id}>
            <NavLink href={`/categories/${category.id}/products`}>
              {category.name}
            </NavLink>
          </Menu.Item>
        ))}
      </Menu.List>
    </Menu>
  );
};

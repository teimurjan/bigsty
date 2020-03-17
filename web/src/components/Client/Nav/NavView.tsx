/** @jsx jsx */
import { NavLink } from 'react-router-dom';

import { css, jsx } from '@emotion/core';
import { IntlShape } from 'react-intl';

import { Menu } from 'src/components/common/Menu/Menu';

import { IViewProps as IProps } from './NavPresenter';
import { mediaQueries } from 'src/styles/media';

export const NavView = ({ intl, categories }: IProps & { intl: IntlShape }) => {
  return (
    <Menu
      css={css`
        width: 250px;
        padding: 0 1.5rem;

        @media ${mediaQueries.maxWidth768} {
          height: auto;
          position: absolute;
          left: -250px;
        }
      `}
    >
      <Menu.List>
        <Menu.Item>
          <NavLink to="/" exact activeClassName="is-active">
            {intl.formatMessage({ id: 'AdminMenu.home' })}
          </NavLink>
        </Menu.Item>
      </Menu.List>
      <Menu.Label>{intl.formatMessage({ id: 'Nav.categories.title' })}</Menu.Label>
      <Menu.List>
        {categories.map(category => (
          <Menu.Item key={category.id}>
            <NavLink to={`/categories/${category.id}/products`} activeClassName="is-active">
              {category.name}
            </NavLink>
          </Menu.Item>
        ))}
      </Menu.List>
    </Menu>
  );
};

/** @jsx jsx */
import * as React from 'react';
import { NavLink, Link } from 'react-router-dom';

import { css, jsx } from '@emotion/core';
import { useIntl, IntlShape } from 'react-intl';

import { Menu } from 'src/components/common/Menu/Menu';
import { ITriggerProps } from 'src/components/common/Dropdown/Dropdown';

import { fullWidthMixin } from 'src/styles/mixins';

import { LanguageDropdownContainer as LanguageDropdown } from '../../LanguageDropdown/LanguageDropdownContainer';

import { IViewProps as IProps } from './AdminHeaderPresenter';
import { mediaQueries } from 'src/styles/media';

const LanguageDrodownTrigger = ({ onClick, ...props }: ITriggerProps) => {
  const intl = useIntl();

  const modifiedOnClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      if (onClick) {
        onClick(e);
      }
    },
    [onClick],
  );

  return (
    <Link css={fullWidthMixin} to="#" onClick={modifiedOnClick} {...props}>
      {intl.formatMessage({ id: 'AdminMenu.changeLangaugeLinkText' })}
    </Link>
  );
};

export const AdminHeaderView = ({ intl, onLogOutClick }: IProps & { intl: IntlShape }) => {
  return (
    <Menu
      css={css`
        width: 100%;
        height: 100vh;
        padding: 3rem 1.5rem;

        @media ${mediaQueries.maxWidth768} {
          height: auto;
        }
      `}
    >
      <Menu.List>
        <Menu.Item>
          <NavLink to="/admin" exact activeClassName="is-active">
            {intl.formatMessage({ id: 'AdminMenu.home' })}
          </NavLink>
        </Menu.Item>
      </Menu.List>
      <Menu.Label>{intl.formatMessage({ id: 'AdminMenu.modelsLabel' })}</Menu.Label>
      <Menu.List>
        <Menu.Item>
          <NavLink to="/admin/categories" activeClassName="is-active">
            {intl.formatMessage({ id: 'AdminMenu.categoriesLinkText' })}
          </NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to="/admin/featureTypes" activeClassName="is-active">
            {intl.formatMessage({ id: 'AdminMenu.featureTypesLinkText' })}
          </NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to="/admin/featureValues" activeClassName="is-active">
            {intl.formatMessage({ id: 'AdminMenu.featureValuesLinkText' })}
          </NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to="/admin/productTypes" activeClassName="is-active">
            {intl.formatMessage({ id: 'AdminMenu.productTypesLinkText' })}
          </NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to="/admin/products" activeClassName="is-active">
            {intl.formatMessage({ id: 'AdminMenu.productsLinkText' })}
          </NavLink>
        </Menu.Item>
      </Menu.List>

      <Menu.Label>{intl.formatMessage({ id: 'AdminMenu.actionsLabel' })}</Menu.Label>
      <Menu.List>
        <Menu.Item>
          <LanguageDropdown css={fullWidthMixin} Trigger={LanguageDrodownTrigger} />
        </Menu.Item>
        <Menu.Item>
          <Link to="#" onClick={onLogOutClick}>
            {intl.formatMessage({ id: 'AdminMenu.logoutLinkText' })}
          </Link>
        </Menu.Item>
      </Menu.List>
    </Menu>
  );
};

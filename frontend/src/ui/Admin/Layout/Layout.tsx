import * as React from 'react';
import Icon from '../../Common/Icon';
import Menu from './Menu/Menu';
import MenuHeader from './Menu/MenuHeader';
import MenuLink from './Menu/MenuLink';
import InjectIntl, { IntlProps } from '../../Common/InjectIntl';

const Layout: React.SFC<IntlProps> = ({intl}) => (
  <div id="wrapper">
    <Menu>
      <MenuHeader>
        <h3>{intl('admin.username.label')}</h3>
      </MenuHeader>
      <MenuLink to="/admin/users">
        <Icon type="user"/> <span className="nav-label">{intl('admin.usersIndex.linkText')}</span>
      </MenuLink>
    </Menu>
  </div>
);

export default InjectIntl(Layout);
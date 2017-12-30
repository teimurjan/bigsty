import * as React from 'react';
import Icon from '../../Common/Icon';
import Menu from './Menu/Menu';
import MenuHeader from './Menu/MenuHeader';
import MenuLink from './Menu/MenuLink';
import injectIntl, { IntlProps } from '../../Common/injectIntl';

export default injectIntl(({intl, children}: IntlProps & React.Props<{}>) => (
  <div id="wrapper">
    <Menu>
      <MenuHeader>
        <h3>Ivan Pupkin</h3>
      </MenuHeader>
      <MenuLink to="/admin/users">
        <Icon type="user"/> <span className="nav-label">{intl('admin.users.linkText')}</span>
      </MenuLink>
    </Menu>
    <div id="content">
      {children}
    </div>
  </div>
));
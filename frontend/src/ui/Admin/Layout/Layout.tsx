import * as React from 'react';
import Icon from '../../Common/Icon';
import Menu from './Menu/Menu';
import MenuHeader from './Menu/MenuHeader';
import MenuLink from './Menu/MenuLink';

export default class Layout extends React.Component {
  render() {
    return (
      <div id="wrapper">
        <Menu>
          <MenuHeader>
            <h3>Username</h3>
          </MenuHeader>
          <MenuLink to="/admin/users">
            <Icon type="user"/> <span className="nav-label">Users</span>
          </MenuLink>
        </Menu>
      </div>
    );
  }
}
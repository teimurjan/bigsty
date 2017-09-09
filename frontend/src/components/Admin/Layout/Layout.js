import React from 'react';
import PropTypes from 'prop-types';
import {SideMenu, MenuItem, TopMenu} from "./Menu";
import {IntlWrapper} from "../../Common/IntlWrapper";

class AdminMain extends React.PureComponent {
  static propTypes = {
    admin: PropTypes.object.isRequired,
    actions: PropTypes.shape({
      logout: PropTypes.func.isRequired
    }).isRequired
  };

  render() {
    return (
      <div>
        <SideMenu title={this.props.admin.name}>
          <MenuItem link="/admin/users" text={this.props.intl('adminMain.sideMenu.users')}
                    icon="fa fa-user"/>
          <MenuItem link="/admin/categories" text={this.props.intl('adminMain.sideMenu.categories')} icon="fa fa-th"/>
          <MenuItem link="/admin/products" text={this.props.intl('adminMain.sideMenu.products')} icon="fa fa-th"/>
        </SideMenu>
        <TopMenu>
          <MenuItem text={this.props.intl('adminMain.topMenu.logout')} onClick={this.props.actions.logout}
                    icon="fa fa-sign-out"/>
        </TopMenu>
        <div id="page-wrapper" className="gray-bg">
          <div className="wrapper wrapper-content">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default IntlWrapper(AdminMain);

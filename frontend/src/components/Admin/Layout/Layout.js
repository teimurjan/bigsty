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
    const {children, intl, actions} = this.props;
    return (
      <div>
        <SideMenu title={intl('adminLayout.sideMenu.title')}>
          <MenuItem link="/admin/users" text={intl('adminLayout.sideMenu.users')}
                    icon="fa fa-user"/>
          <MenuItem link="/admin/categories" text={intl('adminLayout.sideMenu.categories')} icon="fa fa-th"/>
          <MenuItem link="/admin/products" text={intl('adminLayout.sideMenu.products')} icon="fa fa-th"/>
        </SideMenu>
        <TopMenu>
          <MenuItem text={intl('adminLayout.topMenu.logout')} onClick={actions.logout}
                    icon="fa fa-sign-out"/>
        </TopMenu>
        <div id="page-wrapper" className="gray-bg">
          <div className="wrapper wrapper-content">
            {children}
          </div>
        </div>
      </div>
    );
  }
}

export default IntlWrapper(AdminMain);

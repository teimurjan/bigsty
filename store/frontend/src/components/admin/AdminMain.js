import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router";

class Index extends React.Component {
    static propTypes = {
        admin: PropTypes.object.isRequired,
        actions: PropTypes.shape({
            logout: PropTypes.func.isRequired
        }).isRequired
    };

    render() {
        return (
            <div>
                <div className="fixed-sidebar no-skin-config full-height-layout">
                    <div id="wrapper">
                        <nav className="navbar-default navbar-static-side">
                            <div className="sidebar-collapse">
                                <ul className="nav metismenu">
                                    <li className="nav-header">
                                        <div className="profile-element">
                                            <strong
                                                className="font-bold text-info">{`Welcome, ${this.props.admin.name}!`}</strong>
                                        </div>
                                    </li>
                                    <li>
                                        <Link to="/admin/users">
                                            <i className="fa fa-user"/>
                                            <span className="nav-label m-l-xs">Users</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/admin/products">
                                            <i className="fa fa-th"/>
                                            <span className="nav-label m-l-xs">Products</span>
                                        </Link>
                                    </li>
                                    <li className="bg-info">
                                        <Link to="/">
                                            <i className="text-white fa fa-backward"/>
                                            <span className="text-white nav-label m-l-xs">Back home</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </div>
                </div>
                <div id="page-wrapper" className="gray-bg">
                    <div className="row border-bottom">
                        <nav className="navbar navbar-static-top m-b-n">
                            <ul className="nav navbar-top-links navbar-right">
                                <li>
                                    <a onClick={this.props.actions.logout}>
                                        <i className="fa fa-sign-out"/> Log out
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div className="wrapper wrapper-content">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

export default Index;

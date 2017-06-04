import React from 'react';
import Navbar from "./Navbar";
import Footer from "./Footer";
import PropTypes from 'prop-types';

export default class Layout extends React.Component {
    static propTypes = {
        userGroup: PropTypes.string.isRequired,
        isAuthenticated: PropTypes.bool.isRequired,
        categories: PropTypes.array.isRequired,
        actions: PropTypes.shape({
            fetchCategories: PropTypes.func.isRequired,
            logout: PropTypes.func.isRequired
        }).isRequired
    };

    componentWillMount() {
        this.props.actions.fetchCategories();
    }

    render() {
        return (
            <div className="site-wrapper top-navigation">
                <div id="wrapper">
                    <div id="page-wrapper" className="gray-bg">
                        <Navbar
                            userGroup={this.props.userGroup}
                            isAuthenticated={this.props.isAuthenticated}
                            handleLogout={this.props.actions.logout}
                            categories={this.props.categories}
                        />
                        <div className="wrapper">
                            {this.props.children}
                        </div>
                        <Footer/>
                    </div>
                </div>
            </div>
        )
    }
}
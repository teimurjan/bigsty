import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router";
import Dropdown from "./Dropdown";

export default class Navbar extends React.Component {
    static propTypes = {
        userGroup: PropTypes.string.isRequired,
        isAuthenticated: PropTypes.bool.isRequired,
        categories: PropTypes.array.isRequired,
        handleLogout: PropTypes.func.isRequired,
    };


    render() {
        return (
            <div className="row border-bottom white-bg">
                <nav className="navbar navbar-static-top" role="navigation">
                    <div className="navbar-header">
                        <button aria-controls="navbar" aria-expanded="false" data-target="#navbar"
                                data-toggle="collapse" className="navbar-toggle collapsed" type="button">
                            <i className="fa fa-reorder"/>
                        </button>
                        <Link to='/' className="navbar-brand">My Shop</Link>
                    </div>
                    <div className="navbar-collapse collapse" id="navbar">
                        <ul className="nav navbar-nav">
                            <Dropdown>
                                {this.props.categories.map((category, index) => {
                                    return (
                                        <li key={`category-${index}`}>
                                            <Link to={`/categories/${category.id}`}>{category.name}</Link>
                                        </li>)
                                })}
                            </Dropdown>
                            <li>
                                <a role="button" href="#">About us</a>
                            </li>
                            <li>
                                <a role="button" href="#">Contact</a>
                            </li>
                        </ul>
                        <ul className="nav navbar-top-links navbar-right">
                            {this.props.userGroup === 'admin' &&
                            <Link to="/admin">
                                <li>
                                    <button type="button" className="btn btn-w-m btn-primary">
                                        Admin Panel
                                    </button>
                                </li>
                            </Link>}
                            <li>
                                {this.props.isAuthenticated ?
                                    <a onClick={this.props.handleLogout}>
                                        <i className="fa fa-sign-out"/> Log out
                                    </a>
                                    :
                                    <Link to="/registration">
                                        <i className="fa fa-sign-in"/> Log in
                                    </Link>
                                }
                            </li>
                        </ul>
                    </div>
                </nav>
            </
                div >
        )
            ;
    }
}
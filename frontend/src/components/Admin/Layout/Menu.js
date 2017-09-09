import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router";

const MenuItem = (props) => (
  <li>
    <Link to={props.link} onClick={props.onClick}>
      <i className={props.icon}/>
      <span className="nav-label m-l-xs">{props.text}</span>
    </Link>
  </li>
);


MenuItem.propTypes = {
  text: PropTypes.string.isRequired,
  link: PropTypes.string,
  icon: PropTypes.string,
  onClick: PropTypes.func
};

const SideMenu = (props) => (
  <div className="fixed-sidebar no-skin-config full-height-layout">
    <div id="wrapper">
      <nav className="navbar-default navbar-static-side">
        <div className="sidebar-collapse">
          <ul className="nav metismenu">
            <Link to='/'>
              <li style={{padding: '21px'}} className="nav-header bg-primary">
                <div className="profile-element">
                  <i className="fa fa-backward"/>
                  <strong className="font-bold m-l-sm">
                    {props.title}
                  </strong>
                </div>
              </li>
            </Link>
            {props.children}
          </ul>
        </div>
      </nav>
    </div>
  </div>
);

SideMenu.propTypes = {
  title: PropTypes.string.isRequired
};

const TopMenu = (props) => (
  <div className="row border-bottom">
    <nav className="navbar navbar-static-top m-b-n">
      <ul className="nav navbar-top-links navbar-right">
        {props.children}
      </ul>
    </nav>
  </div>
);

export {SideMenu, TopMenu, MenuItem};

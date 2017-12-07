import * as React from 'react';
import { Props } from 'react';

export default ({children}: Props<{}>): JSX.Element => (
  <nav className="navbar-default navbar-static-side" role="navigation">
    <div className="sidebar-collapse">
      <ul className="nav metismenu" id="side-menu">
        {children}
      </ul>
    </div>
  </nav>
);
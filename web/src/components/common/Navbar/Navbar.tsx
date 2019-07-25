import * as React from "react";

import classNames from "classnames";

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Navbar = ({ children, className, ...props }: IProps) => (
  <nav
    className={classNames("navbar", className)}
    role="navigation"
    {...props}
  >
    {children}
  </nav>
);

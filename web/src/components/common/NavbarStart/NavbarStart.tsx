import * as React from "react";

import classNames from "classnames";

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const NavbarStart = ({ children, className, ...props }: IProps) => (
  <div className={classNames("navbar-start", className)} {...props}>
    {children}
  </div>
);

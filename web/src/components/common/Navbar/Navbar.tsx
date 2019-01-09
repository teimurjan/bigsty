import classNames from "classnames";
import * as React from "react";

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export class Navbar extends React.Component<IProps> {
  public render() {
    const { children, className, ...props } = this.props;
    return (
      <nav
        className={classNames("navbar", className)}
        role="navigation"
        aria-label="main navigation"
        {...props}
      >
        {children}
      </nav>
    );
  }
}

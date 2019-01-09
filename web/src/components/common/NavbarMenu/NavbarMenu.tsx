import classNames from "classnames";
import * as React from "react";

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  isActive: boolean;
}

export class NavbarMenu extends React.Component<IProps> {
  public render() {
    const { children, className, isActive, ...props } = this.props;
    return (
      <div
        className={classNames("navbar-menu", className, {
          "is-active": isActive
        })}
        {...props}
      >
        {children}
      </div>
    );
  }
}

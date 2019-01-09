import classNames from "classnames";
import * as React from "react";
import { Link, LinkProps } from "react-router-dom";

export interface IProps extends LinkProps {
  children?: React.ReactNode;
}

export class DropdownItemLink extends React.Component<IProps> {
  public render() {
    const { children, className, to, ...props } = this.props;
    return (
      <Link
        to={to}
        className={classNames("dropdown-item", className)}
        {...props}
      >
        {children}
      </Link>
    );
  }
}

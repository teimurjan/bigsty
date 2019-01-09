import classNames from "classnames";
import * as React from "react";
import { Link, LinkProps } from "react-router-dom";

export interface IProps extends LinkProps {
  color:
    | "is-primary"
    | "is-link"
    | "is-info"
    | "is-success"
    | "is-warning"
    | "is-danger"
    | "is-dark";
}

export class LinkButton extends React.Component<IProps> {
  public render() {
    const { children, color, className, ...props } = this.props;
    return (
      <Link className={classNames("button", className, color)} {...props}>
        {children}
      </Link>
    );
  }
}

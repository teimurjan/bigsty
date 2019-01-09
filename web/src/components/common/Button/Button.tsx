import classNames from "classnames";
import * as React from "react";

export interface IProps extends React.HTMLProps<HTMLButtonElement> {
  children?: React.ReactNode;
  color:
    | "is-primary"
    | "is-link"
    | "is-info"
    | "is-success"
    | "is-warning"
    | "is-danger"
    | "is-dark";
}

export class Button extends React.Component<IProps> {
  public render() {
    const { children, color, className, ...props } = this.props;
    return (
      <button className={classNames("button", className, color)} {...props}>
        {children}
      </button>
    );
  }
}

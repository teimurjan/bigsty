import * as React from "react";

import classNames from "classnames";

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

export const Button = ({ children, color, className, ...props }: IProps) => (
  <button className={classNames("button", className, color)} {...props}>
    {children}
  </button>
);

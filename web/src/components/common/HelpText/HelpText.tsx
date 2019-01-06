import classNames from "classnames";
import * as React from "react";

export interface IProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
  type?: "is-danger" | "is-success";
}

export class HelpText extends React.Component<IProps> {
  public render() {
    const { children, type, className } = this.props;
    return <p className={classNames("help", className, type)}>{children}</p>;
  }
}

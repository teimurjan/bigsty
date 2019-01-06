import classNames from "classnames";
import * as React from "react";

export interface IProps extends React.HTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode;
}

export class Label extends React.Component<IProps> {
  public render() {
    const { children, className } = this.props;
    return <label className={classNames("label", className)}>{children}</label>;
  }
}

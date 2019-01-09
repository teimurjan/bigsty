import classNames from "classnames";
import * as React from "react";

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export class Control extends React.Component<IProps> {
  public render() {
    const { children, className, ...props } = this.props;
    return (
      <div className={classNames("control", className)} {...props}>
        {children}
      </div>
    );
  }
}

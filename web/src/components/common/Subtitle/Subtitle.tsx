import classNames from "classnames";
import * as React from "react";

export interface IProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
  size: 1 | 2 | 3 | 4 | 5 | 6;
}

export class Subtitle extends React.Component<IProps> {
  public render() {
    const { children, size, className, ...props } = this.props;
    return React.createElement(
      `h${size}`,
      { className: classNames("subtitle", className, `is-${size}`), ...props },
      children
    );
  }
}

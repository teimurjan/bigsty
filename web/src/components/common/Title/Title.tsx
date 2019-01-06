import classNames from "classnames";
import * as React from "react";

export interface IProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
  size: 1 | 2 | 3 | 4 | 5 | 6;
}

export class Title extends React.Component<IProps> {
  public render() {
    const { children, size, className } = this.props;
    return React.createElement(
      `h${size}`,
      { className: classNames("title", className, `is-${size}`) },
      children
    );
  }
}

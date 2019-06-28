import * as React from "react";

import classNames from "classnames";

export interface IProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
  size: 1 | 2 | 3 | 4 | 5 | 6;
}

export const Subtitle = ({ children, size, className, ...props }: IProps) =>
  React.createElement(
    `h${size}`,
    { className: classNames("subtitle", className, `is-${size}`), ...props },
    children
  );

import * as React from "react";

import classNames from "classnames";

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Column = ({ children, className, ...props }: IProps) => (
  <div className={classNames("column", className)} {...props}>
    {children}
  </div>
);

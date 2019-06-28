import * as React from "react";

import classNames from "classnames";

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Control = ({ children, className, ...props }: IProps) => (
  <div className={classNames("control", className)} {...props}>
    {children}
  </div>
);

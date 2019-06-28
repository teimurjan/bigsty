import * as React from "react";

import classNames from "classnames";

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Card = ({ children, className, ...props }: IProps) => (
  <div className={classNames("card", className)} {...props}>
    {children}
  </div>
);

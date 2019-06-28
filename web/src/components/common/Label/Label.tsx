import * as React from "react";

import classNames from "classnames";

export interface IProps extends React.HTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode;
}

export const Label = ({ children, className, ...props }: IProps) => (
  <label className={classNames("label", className)} {...props}>
    {children}
  </label>
);

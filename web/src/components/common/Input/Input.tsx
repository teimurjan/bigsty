import * as React from "react";

import classNames from "classnames";

export interface IProps extends React.HTMLProps<HTMLInputElement> {
  isDanger?: boolean;
}

export const Input = ({ className, isDanger, ...props }: IProps) => (
  <input
    className={classNames("input", className, { "is-danger": isDanger })}
    {...props}
  />
);

import * as React from "react";

import classNames from "classnames";

export interface IProps extends React.HTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export const ModalClose = ({ children, className, ...props }: IProps) => (
  <button className={classNames("modal-close", className)} {...props}>
    {children}
  </button>
);

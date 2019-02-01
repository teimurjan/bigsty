import classNames from "classnames";
import * as React from "react";

export interface IProps extends React.HTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export class ModalClose extends React.Component<IProps> {
  public render() {
    const { children, className, ...props } = this.props;
    return (
      <button className={classNames("modal-close", className)} {...props}>
        {children}
      </button>
    );
  }
}

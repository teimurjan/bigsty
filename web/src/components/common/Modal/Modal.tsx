import classNames from "classnames";
import * as React from "react";
import * as ReactDOM from "react-dom";

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  isOpen: boolean;
}

export class Modal extends React.Component<IProps> {
  public render() {
    const { children, className, isOpen, ...props } = this.props;
    const modalRoot = document.getElementById("modalRoot");
    return modalRoot
      ? ReactDOM.createPortal(
          <div
            className={classNames("modal", { "is-active": isOpen }, className)}
            {...props}
          >
            {children}
          </div>,
          modalRoot
        )
      : null;
  }
}

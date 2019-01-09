import classNames from "classnames";
import * as React from "react";

interface IProps extends React.HTMLAttributes<HTMLButtonElement> {
  isActive: boolean;
}

export class NavbarBurger extends React.Component<IProps> {
  public render() {
    const { className, isActive, ...props } = this.props;
    return (
      <button
        role="button"
        className={classNames("navbar-burger burger", className, {
          "is-active": isActive
        })}
        aria-label="menu"
        {...props}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
    );
  }
}

import classNames from "classnames";
import * as React from "react";

export interface IProps extends React.HTMLAttributes<HTMLInputElement> {
  isDanger?: boolean;
}

export class Input extends React.Component<IProps> {
  public render() {
    const { className, isDanger, ...props } = this.props;
    return (
      <input
        className={classNames("input", className, { "is-danger": isDanger })}
        {...props}
      />
    );
  }
}

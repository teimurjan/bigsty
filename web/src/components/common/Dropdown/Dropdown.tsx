import classNames from "classnames";
import * as React from "react";

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  Trigger:
    | React.ComponentClass<ITriggerProps>
    | React.StatelessComponent<ITriggerProps>;
}

export interface ITriggerProps extends React.HTMLAttributes<HTMLElement> {}

interface IState {
  isOpen: boolean;
}

export class Dropdown extends React.Component<IProps, IState> {
  public state = {
    isOpen: false
  };

  public render() {
    const { isOpen } = this.state;
    const { children, className, Trigger, ...props } = this.props;
    return (
      <div
        className={classNames("dropdown", className, { "is-active": isOpen })}
        {...props}
      >
        <div className="dropdown-trigger">
          <Trigger onClick={this.toggleOpen} />
        </div>
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">{children}</div>
        </div>
      </div>
    );
  }

  private toggleOpen = () => this.setState({ isOpen: !this.state.isOpen });
}

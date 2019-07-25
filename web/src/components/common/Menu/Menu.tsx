import * as React from "react";

import classNames from "classnames";

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Menu = ({ children, className, ...props }: IProps) => (
  <aside className={classNames("menu", className)} {...props}>
    {children}
  </aside>
);

export interface IMenuLabelProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

Menu.Label = ({ children, className, ...props }: IMenuLabelProps) => (
  <p className={classNames("menu-label", className)} {...props}>
    {children}
  </p>
);

export interface IMenuListProps extends React.HTMLAttributes<HTMLUListElement> {
  className?: string;
  children?: React.ReactNode | HTMLCollection;
}

Menu.List = ({ children, className }: IMenuListProps) => (
  <ul className={classNames("menu-list", className)}>{children}</ul>
);

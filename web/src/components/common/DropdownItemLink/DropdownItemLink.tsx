/** @jsx jsx */
import * as React from "react";

import { css, jsx } from "@emotion/core";
import { Link, LinkProps } from "react-router-dom";

import classNames from "classnames";

export interface IProps extends LinkProps {
  children?: React.ReactNode;
  level?: number;
}

export const DropdownItemLink = ({
  children,
  className,
  to,
  level = 1,
  ...props
}: IProps) => (
  <Link to={to} className={classNames("dropdown-item", className)} {...props}>
    <span
      css={css`
        font-weight: bold;
      `}
      className="has-text-dark"
    >
      {level > 1 ? `${"\u00A0".repeat(level)}\u00A0` : " "}
    </span>
    {"  "}
    {children}
  </Link>
);

/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import classNames from "classnames";
import * as React from "react";
import { InjectedIntlProps } from "react-intl";
import { Link } from "react-router-dom";
import {
  alignItemsCenterMixin,
  flexDirectionColumnMixin,
  flexMixin,
  fullViewHeightMixin,
  fullWidthMixin,
  justifyContentCenterMixin
} from "src/styles/mixins";
import { Button } from "../common/Button/Button";
import { Title } from "../common/Title/Title";

export class NotFoundView extends React.Component<InjectedIntlProps> {
  public render() {
    const { intl } = this.props;
    return (
      <div
        css={css`
          ${flexMixin};
          ${fullViewHeightMixin};
          ${fullWidthMixin};
          ${alignItemsCenterMixin};
          ${justifyContentCenterMixin};
          ${flexDirectionColumnMixin};
        `}
        className={classNames("has-background-warning", "has-text-gray")}
      >
        <Title className="is-uppercase" size={1}>
          {intl.formatMessage({ id: "NotFound.title" })}
        </Title>
        <Link to="/">
          <Button
            className={classNames("is-medium", "is-uppercase")}
            color="is-dark"
          >
            {intl.formatMessage({ id: "NotFound.goHome.text" })}
          </Button>
        </Link>
      </div>
    );
  }
}

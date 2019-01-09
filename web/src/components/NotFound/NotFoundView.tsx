/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import classNames from "classnames";
import * as React from "react";
import { InjectedIntlProps } from "react-intl";
import {
  alignItemsCenterMixin,
  flexDirectionColumnMixin,
  flexMixin,
  fullViewHeightMixin,
  fullWidthMixin,
  justifyContentCenterMixin
} from "src/styles/mixins";
import { LinkButton } from "../common/LinkButton/LinkButton";
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
        <LinkButton
          className={classNames("is-medium", "is-uppercase")}
          color="is-dark"
          to="/"
        >
          {intl.formatMessage({ id: "NotFound.goHome.text" })}
        </LinkButton>
      </div>
    );
  }
}

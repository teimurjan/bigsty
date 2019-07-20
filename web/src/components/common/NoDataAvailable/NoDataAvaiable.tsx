/** @jsx jsx */
import * as React from "react";

import { css, jsx } from "@emotion/core";
import classNames from "classnames";

import { Hero } from "src/components/common/Hero/Hero";
import { HeroBody } from "src/components/common/HeroBody/HeroBody";
import { Title } from "src/components/common/Title/Title";
import { textCenterMixin } from "src/styles/mixins";
import { Subtitle } from "../Subtitle/Subtitle";

interface IProps {
  title?: string | undefined;
  description?: string | undefined;
  CTA?: React.ReactNode | undefined;
}

export const NoDataAvailable = ({ title, description, CTA }: IProps) => (
  <Hero className={classNames("is-large")}>
    <HeroBody
      css={css`
        ${textCenterMixin};
      `}
    >
      {title && <Title size={3}>{title}</Title>}
      {description && <Subtitle size={6}>{description}</Subtitle>}
      {CTA}
    </HeroBody>
  </Hero>
);

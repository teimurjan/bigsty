/** @jsx jsx */
import * as React from 'react';

import { css, jsx } from '@emotion/core';

import {
  alignItemsCenterMixin,
  flexMixin,
  fullHeightMixin,
  fullWidthMixin,
  justifyContentCenterMixin,
} from 'src/styles/mixins';

import { Title } from 'src/components/common/Title/Title';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const ErrorLayout = ({ children, ...props }: IProps) => (
  <div
    css={css`
      ${alignItemsCenterMixin};
      ${flexMixin};
      ${justifyContentCenterMixin};
      ${fullWidthMixin};
      ${fullHeightMixin};
    `}
    {...props}
  >
    <Title size={3}>{children}</Title>
  </div>
);

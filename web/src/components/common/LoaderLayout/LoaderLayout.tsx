/** @jsx jsx */
import * as React from 'react';

import { css, jsx } from '@emotion/core';
import { withTheme } from 'emotion-theming';
import ClipLoader from 'react-spinners/ClipLoader';

import { alignItemsCenterMixin, flexMixin, fullWidthMixin, justifyContentCenterMixin } from 'src/styles/mixins';
import { ITheme } from 'src/themes';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  loaderColor?: string;
  theme: ITheme;
}

export const LoaderLayout = withTheme(({ children, loaderColor, theme, ...props }: IProps) => (
  <div
    css={css`
      ${alignItemsCenterMixin};
      ${flexMixin};
      ${justifyContentCenterMixin};
      ${fullWidthMixin};
    `}
    {...props}
  >
    <ClipLoader color={theme.primary} sizeUnit="rem" size={3} loading={true} />
  </div>
));

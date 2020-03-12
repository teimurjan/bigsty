/** @jsx jsx */
import * as React from 'react';

import { css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import ClipLoader from 'react-spinners/ClipLoader';

import { alignItemsCenterMixin, flexMixin, fullWidthMixin, justifyContentCenterMixin } from 'src/styles/mixins';

import { ITheme } from 'src/themes';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: string;
}

export const LoaderLayout = ({ color, ...props }: IProps) => {
  const theme = useTheme<ITheme>();

  return (
    <div
      css={css`
        ${alignItemsCenterMixin};
        ${flexMixin};
        ${justifyContentCenterMixin};
        ${fullWidthMixin};
      `}
      {...props}
    >
      <ClipLoader color={color || theme.info} sizeUnit="rem" size={3} loading={true} />
    </div>
  );
};

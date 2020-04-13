/** @jsx jsx */

import { css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import * as React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

import { ITheme } from 'src/themes';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: string;
}

export const LoaderLayout = ({ color, ...props }: IProps) => {
  const theme = useTheme<ITheme>();

  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
      `}
      {...props}
    >
      <ClipLoader color={color || theme.info} sizeUnit="rem" size={3} loading={true} />
    </div>
  );
};

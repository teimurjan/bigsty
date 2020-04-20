/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import * as React from 'react';

import { mediaQueries } from 'src/styles/media';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Container = ({ children, className, ...props }: IProps) => (
  <div
    css={css`
      padding: 0 25px;
      width: 100%;

      @media ${mediaQueries.maxWidth768} {
        padding: 0 15px;
      }
    `}
    className={className}
    {...props}
  >
    {children}
  </div>
);

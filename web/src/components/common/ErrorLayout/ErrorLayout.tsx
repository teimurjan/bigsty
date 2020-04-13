/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import * as React from 'react';

import { Title } from 'src/components/common/Title/Title';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const ErrorLayout = ({ children, ...props }: IProps) => (
  <div
    css={css`
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100vh;
    `}
    {...props}
  >
    <Title size={3}>{children}</Title>
  </div>
);

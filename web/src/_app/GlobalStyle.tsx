import { Global, css } from '@emotion/core';
import * as React from 'react';

export const GlobalStyles = () => (
  <Global
    styles={css`
      body {
        font-family: 'Nunito', sans-serif;
      }
    `}
  />
);

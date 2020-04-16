/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';

import { mediaQueries } from 'src/styles/media';

interface IProps {
  children: React.ReactNode;
  icon: IconProp;
  size?: SizeProp;
  hideTextOnMobile?: boolean;
}

export const WithIcon = ({ children, icon, size, hideTextOnMobile = false }: IProps) => (
  <span
    css={css`
      display: flex;
      align-items: center;
    `}
  >
    <span
      css={css`
        @media ${mediaQueries.maxWidth768} {
          display: ${hideTextOnMobile ? 'none' : undefined};
        }
      `}
    >
      {children}
    </span>
    <FontAwesomeIcon
      css={css`
        margin-left: 5px;
      `}
      icon={icon}
      size={size}
    />
  </span>
);

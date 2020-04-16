import { ClassNames } from '@emotion/core';
import classNames from 'classnames';
import { useTheme } from 'emotion-theming';
import times from 'lodash/times';
import * as React from 'react';

import { mediaQueries } from 'src/styles/media';

export interface IProps {
  children?: React.ReactNode | string;
  size: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

const fontSizes = {
  1: 48,
  2: 36,
  3: 26,
  4: 22,
  5: 18,
  6: 14,
};

const toMobileSize = (size: number) => size * 0.77;

export const Subtitle = ({ children, size, className }: IProps) => {
  const theme = useTheme<CSSThemeV2>();
  return (
    <ClassNames>
      {({ css }) =>
        React.createElement(
          `h${size}`,
          {
            className: classNames(
              className,
              `size-${size}`,
              css`
                color: ${theme.textSecondaryColor};
                font-weight: 500;

                ${times(6)
                  .map(i => {
                    const sizeI = i + 1;
                    const fontSize = fontSizes[sizeI];
                    return `
                    &.size-${sizeI} {
                      font-size: ${fontSize}px;

                      @media ${mediaQueries.maxWidth768} {
                        font-size: ${toMobileSize(fontSize)}px;
                      }
                    }
                  `;
                  })
                  .join('\n')}
              `,
            ),
          },
          children,
        )
      }
    </ClassNames>
  );
};

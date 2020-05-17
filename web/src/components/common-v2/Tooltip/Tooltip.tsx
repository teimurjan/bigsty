/** @jsx jsx */
import { css, jsx, ClassNames } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import React from 'react';

import { Popover, IProps as IPopoverProps } from 'src/components/common-v2/Popover/Popover';
import { useLazyInitialization } from 'src/hooks/useLazyInitialization';
import { mediaQueries } from 'src/styles/media';
import { safeWindow } from 'src/utils/dom';

export interface ITooltipContentProps {
  children?: React.ReactNode;
}

const TooltipContent = React.forwardRef<HTMLDivElement, ITooltipContentProps>(({ children }, ref) => {
  const theme = useTheme<CSSThemeV2>();

  return (
    <div
      ref={ref}
      css={css`
        background: ${theme.tooltipBackgroundColor};
        padding: 5px 10px;
        width: 200px;
        color: ${theme.textOnPrimaryColor};

        @media ${mediaQueries.maxWidth768} {
          width: 150px;
        }
      `}
    >
      {children}
    </div>
  );
});

export const Tooltip = <T extends HTMLElement>({ children, ...props }: IPopoverProps<T>) => {
  const theme = useTheme<CSSThemeV2>();

  return (
    <ClassNames>
      {({ css: css_ }) => (
        <Popover {...props} arrowClassName={css_`background: ${theme.tooltipBackgroundColor};`} openOnHover hasArrow>
          <TooltipContent>{children}</TooltipContent>
        </Popover>
      )}
    </ClassNames>
  );
};

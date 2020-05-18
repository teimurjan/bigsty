/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import classNames from 'classnames';
import { useTheme } from 'emotion-theming';
import React from 'react';

interface IProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: 'default' | 'danger';
}

export const HelpText: React.FC<IProps> = ({ children, className, color, ...props }) => {
  const theme = useTheme<CSSThemeV2>();
  return (
    <small
      css={css`
        &.danger {
          color: ${theme.dangerColor};
        }
      `}
      className={classNames(className, { color })}
      {...props}
    >
      {children}
    </small>
  );
};

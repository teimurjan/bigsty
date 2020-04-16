/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import { useTheme } from 'emotion-theming';
import Link, { LinkProps } from 'next/link';
import * as React from 'react';

export interface IProps {
  color?: 'light' | 'default' | 'dark';
  size?: 'default' | 'mini';
  inverted?: boolean;
  loading?: boolean;
  disabled?: boolean;
  circled?: boolean;
  type?: 'submit' | 'reset' | 'button';
  className?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler;
}

export const Button = React.forwardRef<HTMLButtonElement, IProps>(
  (
    {
      children,
      color = 'default',
      className,
      inverted = false,
      loading = false,
      circled = false,
      type = 'button',
      size,
      onClick,
    },
    ref,
  ) => {
    const theme = useTheme<CSSThemeV2>();

    return (
      <button
        ref={ref}
        onClick={onClick}
        css={css`
          border-radius: 24px;
          transition: all 200ms;
          font-size: 16px;
          width: 240px;
          height: 48px;
          cursor: pointer;
          font-weight: 500;
          outline: none;

          &.default {
            color: ${theme.buttonDefaultColor};
            border: 1px solid ${theme.buttonDefaultBorderColor};
            background: ${theme.buttonDefaultBackgroundColor};

            &:hover {
              color: ${theme.buttonDefaultHoverColor};
              background: ${theme.buttonDefaultBackgroundHoverColor};
            }
          }

          &.light {
            color: ${theme.buttonLightColor};
            border: 1px solid ${theme.buttonLightBorderColor};
            background: ${theme.buttonLightBackgroundColor};

            &:hover {
              color: ${theme.buttonLightHoverColor};
              background: ${theme.buttonLightBackgroundHoverColor};
            }
          }

          &.dark {
            color: ${theme.buttonDarkColor};
            border: 1px solid ${theme.buttonDarkBorderColor};
            background: ${theme.buttonDarkBackgroundColor};

            &:hover {
              color: ${theme.buttonDarkHoverColor};
              background: ${theme.buttonDarkBackgroundHoverColor};
            }
          }

          &.mini {
            height: auto;
            width: auto;
            padding: 2.5px 5px;
            font-size: 8px;
            text-transform: uppercase;
            font-weight: bold;
          }

          &.circled {
            border-radius: 50%;
            width: 24px;
            height: 24px;

            &.mini {
              width: 18px;
              height: 18px;
            }
          }
        `}
        className={classNames(className, color, size, {
          loading,
          inverted,
          circled,
        })}
        type={type}
      >
        {children}
      </button>
    );
  },
);

export const LinkButton: React.FC<LinkProps & IProps> = ({
  className,
  color,
  inverted,
  loading,
  disabled,
  type,
  children,
  ...linkProps
}) => (
  <Link {...linkProps}>
    <Button color={color} className={className} inverted={inverted} loading={loading} disabled={disabled} type={type}>
      {children}
    </Button>
  </Link>
);

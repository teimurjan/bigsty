/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import { useTheme } from 'emotion-theming';
import Link from 'next/link';
import * as React from 'react';

interface IProps {
  className?: string;
  secondary?: boolean;
  href?: string;
  asPath?: string;
  onClick?: React.MouseEventHandler;
  onMouseEnter?: React.MouseEventHandler;
  active?: boolean;
  thin?: boolean;
  children: React.ReactNode;
  rel?: string;
  target?: string;
  plain?: boolean;
}

export const Anchor = React.forwardRef<HTMLAnchorElement, IProps>(
  ({ className, children, href, asPath, onClick, onMouseEnter, active, thin, rel, target, plain, secondary}, ref) => {
    const theme = useTheme<CSSThemeV2>();

    const modifiedOnClick = React.useCallback(
      e => {
        if (!href) {
          e.preventDefault();
        }

        onClick && onClick(e);
      },
      [href, onClick],
    );
      
      const hoverColor = secondary ? theme.anchorSecondaryColor : theme.anchorColor;

    const anchor = (  
      <a
        ref={ref}
        rel={rel}
        target={target}
        className={classNames(className, { active, thin })}
        href={href || '#'}
        onClick={modifiedOnClick}
        onMouseEnter={onMouseEnter}
        css={css`
          color: ${theme.anchorColor};
          transition: color 300ms;
          position: relative;
          display: inline-block;
          font-weight: bold;

          &:hover {
            color: ${hoverColor} !important;
          }

          .anchor > &::before {
            content: '';
            position: absolute;
            bottom: -2.5px;
            width: 100%;
            height: 2px;
            transform: translateX(-100%);
            background: ${hoverColor};
            transition: transform 200ms;
          }

          .anchor:hover > &::before,
          &.active::before {
            transform: translateX(0);
          }

          &.thin {
            font-weight: 500;
          }
        `}
      >
        {children}
      </a>
    );

    return (
      <div
        className="anchor"
        css={css`
          overflow: hidden;
          cursor: pointer;
          padding: 5px 0;
        `}
      >
        {href && !plain ? (
          <Link href={href} as={asPath}>
            {anchor}
          </Link>
        ) : (
          anchor
        )}
      </div>
    );
  },
);

/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import useClickOutside from 'src/hooks/useClickOutside';
import { useDebounce } from 'src/hooks/useDebounce';
import { safeDocument } from 'src/utils/dom';

type FromSide = 'top' | 'left' | 'bottom' | 'right';

const cssOfSide = {
  top: {
    permanent: css`
      top: 0;
      left: 0;
      width: 100%;
    `,
    initial: css`
      opacity: 0;
      transform: translateY(-100%);
    `,
    final: css`
      opacity: 1;
      transform: translateY(0);
    `,
  },
  left: {
    permanent: css`
      top: 0;
      left: 0;
      height: 100%;
    `,
    initial: css`
      opacity: 0;
      transform: translateX(-100%);
    `,
    final: css`
      opacity: 1;
      transform: translateX(0);
    `,
  },
  bottom: {
    permanent: css`
      bottom: 0;
      left: 0;
      width: 100%;
    `,
    initial: css`
      opacity: 0;
      transform: translateY(100%);
    `,
    final: css`
      opacity: 1;
      transform: translateY(0);
    `,
  },
  right: {
    permanent: css`
      top: 0;
      right: 0;
      height: 100%;
    `,
    initial: css`
      opacity: 0;
      transform: translateX(100%);
    `,
    final: css`
      opacity: 1;
      transform: translateX(0);
    `,
  },
};

const getSlidingCSS = (from: FromSide) => {
  const { permanent, initial, final } = cssOfSide[from];
  return css`
    transition: transform 300ms ease-in-out, opacity 175ms ease-in-out;
    position: absolute;
    z-index: 99;
    ${permanent};
    ${initial}

    &.sliding-enter {
      ${initial}
    }
    &.sliding-enter-active,
    &.sliding-enter-done {
      ${final}
    }
    &.sliding-exit {
      ${final}
    }
    &.sliding-exit-active,
    &.sliding-exit-done {
      ${initial}
    }
  `;
};

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  isOpen: boolean;
  fromSide: FromSide;
  close: () => void;
}

export const Drawer = ({ children, className, isOpen, fromSide, close, ...props }: IProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  useClickOutside([ref], () => {
    if (isOpen) {
      close();
    }
  });

  const drawerRoot = safeDocument(d => d.getElementById('drawerRoot'), null);
  const slidingCSS = getSlidingCSS(fromSide);

  return drawerRoot
    ? ReactDOM.createPortal(
        <CSSTransition in={isOpen} timeout={300} classNames="sliding" unmountOnExit appear>
          <div ref={ref} css={slidingCSS} {...props}>
            {children}
          </div>
        </CSSTransition>,
        drawerRoot,
      )
    : null;
};

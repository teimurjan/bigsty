/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import { ModalBackground } from 'src/components/common/ModalBackground/ModalBackground';
import useClickOutside from 'src/hooks/useClickOutside';
import { useModalScrollLock } from 'src/hooks/useModalScrollLock';
import { safeDocument } from 'src/utils/dom';

type FromSide = 'top' | 'left' | 'bottom' | 'right';

const cssOfSide = {
  top: {
    permanent: css`
      top: 0;
      left: 0;
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
    width: 100%;
    height: 100%;

    & > .drawer-content {
      height: 100%;
      box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.15), 0 8px 8px 0 rgba(0, 0, 0, 0.05);
      transition: transform 300ms ease-in-out, opacity 175ms ease-in-out;
      position: absolute;
      z-index: 99;
      ${permanent};
      ${initial}
    }

    & > .modal-background {
      z-index: 98;
      transition: opacity 175ms ease-in-out;
    }

    &.sliding-enter > .drawer-content {
      ${initial}
    }
    &.sliding-enter-active > .drawer-content,
    &.sliding-enter-done > .drawer-content {
      ${final}
    }
    &.sliding-exit > .drawer-content {
      ${final}
    }
    &.sliding-exit-active > .drawer-content,
    &.sliding-exit-done > .drawer-content {
      ${initial}
    }

    &.sliding-enter > .modal-background {
      opacity: 0;
    }
    &.sliding-enter-active > .modal-background,
    &.sliding-enter-done > .modal-background {
      opacity: 1;
    }
    &.sliding-exit > .modal-background {
      opacity: 1;
    }
    &.sliding-exit-active > .modal-background,
    &.sliding-exit-done > .modal-background {
      opacity: 0;
    }
  `;
};

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  isOpen: boolean;
  backdrop?: boolean;
  fromSide: FromSide;
  close: () => void;
  onEnter?: () => void;
  onEntered?: () => void;
  onExit?: () => void;
  onExited?: () => void;
}

export const Drawer = ({
  children,
  className,
  isOpen,
  fromSide,
  close,
  onEnter,
  onEntered,
  onExit,
  onExited,
  backdrop,
  ...props
}: IProps) => {
  useModalScrollLock(isOpen);

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
        <CSSTransition
          in={isOpen}
          timeout={300}
          classNames="sliding"
          unmountOnExit
          onEnter={onEnter}
          onEntered={onEntered}
          onExit={onExit}
          onExited={onExited}
        >
          <div css={slidingCSS}>
            <div className="drawer-content" ref={ref} {...props}>
              {children}
            </div>
            {backdrop && <ModalBackground></ModalBackground>}
          </div>
        </CSSTransition>,
        drawerRoot,
      )
    : null;
};

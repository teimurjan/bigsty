/** @jsx jsx */
import * as React from 'react';

import classNames from 'classnames';
import { css, jsx } from '@emotion/core';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export const CarouselItem = React.forwardRef<HTMLDivElement, { className?: string; children: React.ReactNode }>(
  ({ children, className }, ref) => (
    <div
      className={classNames(className, 'carousel-item')}
      ref={ref}
      css={css`
        position: absolute;
        top: 0;
        left: 0;
        animation-fill-mode: forwards;
        -webkit-backface-visibility: hidden;
        transition: left 500ms ease-in-out;

        &.slide-enter {
          left: 100%;
        }

        &.slide-enter-active {
          left: 0;
        }

        &.slide-exit {
          left: 0;
        }

        &.slide-exit-active {
          left: -100%;
        }
      `}
    >
      {children}
    </div>
  ),
);

interface IProps {
  activeIndex: number;
}

export const Carousel: React.FC<IProps> = ({ children, activeIndex }) => {
  const activeItemRef = React.createRef<HTMLDivElement>();
  const [dimensions, setDimensions] = React.useState<{ width: number; height: number } | undefined>(undefined);

  const correctDimensions = React.useCallback(() => {
    if (activeItemRef.current) {
      const boundingRect = activeItemRef.current.getBoundingClientRect();
      if (!dimensions || boundingRect.width !== dimensions.width || boundingRect.height !== dimensions.height) {
        setDimensions({ width: boundingRect.width, height: boundingRect.height });
      }
    }
  }, [activeItemRef, dimensions]);

  React.useLayoutEffect(() => {
    if (activeItemRef.current) {
      correctDimensions();

      window.addEventListener('resize', correctDimensions);
      return () => window.removeEventListener('resize', correctDimensions);
    }

    return undefined;
  }, [activeItemRef, correctDimensions, dimensions]);

  const activeItem = React.useMemo(() => React.Children.toArray(children)[activeIndex], [activeIndex, children]);
  const activeItemWithRef = React.useMemo(
    () => React.cloneElement(activeItem as React.ReactElement, { ref: activeItemRef }),
    [activeItem, activeItemRef],
  );

  return (
    <div
      css={css`
        position: relative;
        overflow: hidden;
        width: ${dimensions ? `${dimensions.width}px` : 'unset'};
        height: ${dimensions ? `${dimensions.height}px` : 'unset'};
        transition: ${dimensions ? `height 500ms ease-in-out` : 'none'};
      `}
      className="carousel"
    >
      <TransitionGroup component={null}>
        <CSSTransition key={activeIndex} classNames="slide" timeout={500} unmountOnExit mountOnEnter>
          {activeItemWithRef}
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};

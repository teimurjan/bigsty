/** @jsx jsx */
import * as React from 'react';

import classNames from 'classnames';
import { css, jsx } from '@emotion/core';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useDimensions } from 'src/hooks/useDimensions';

interface ICarouselItemProps {
  className?: string;
  children: React.ReactNode;
}

export const CarouselItem = React.forwardRef<HTMLDivElement, ICarouselItemProps>(({ children, className }, ref) => (
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
));

interface IProps {
  activeIndex: number;
  fullWidth?: boolean;
}

export const Carousel: React.FC<IProps> = ({ children, activeIndex, fullWidth = false }) => {
  const activeItemRef = React.createRef<HTMLDivElement>();
  const dimensions = useDimensions(activeItemRef);

  const activeItem = React.useMemo(() => React.Children.toArray(children)[activeIndex], [activeIndex, children]);
  const activeItemWithRef = React.useMemo(
    () => React.cloneElement(activeItem as React.ReactElement, { ref: activeItemRef }),
    [activeItem, activeItemRef],
  );

  const width = React.useMemo(() => {
    if (fullWidth) {
      return '100%';
    }
    if (dimensions) {
      return `${dimensions.width}px`;
    }

    return undefined;
  }, [dimensions, fullWidth]);

  return (
    <div
      css={css`
        position: relative;
        overflow: hidden;
        width: ${width};
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

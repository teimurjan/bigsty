/** @jsx jsx */
import * as React from 'react';

import classNames from 'classnames';
import { css, jsx } from '@emotion/core';

import { flexMixin } from 'src/styles/mixins';

interface ICarouselItemProps {
  className?: string;
  children: React.ReactNode;
}

export const CarouselItem = React.forwardRef<HTMLDivElement, ICarouselItemProps>(({ children, className }, ref) => (
  <div
    className={classNames(className, 'carousel-item')}
    ref={ref}
    css={css`
      flex: 0 0 100%;
      position: relative;
    `}
  >
    {children}
  </div>
));

interface IProps {
  activeIndex: number;
  fullWidth?: boolean;
  className?: string;
}

export const Carousel: React.FC<IProps> = ({ className, children, activeIndex, fullWidth = false }) => {
  const width = React.useMemo(() => {
    if (fullWidth) {
      return '100%';
    }
    return undefined;
  }, [fullWidth]);

  return (
    <div
      className={className}
      css={css`
        overflow: hidden;
      `}
    >
      <div
        css={css`
          ${flexMixin};
          width: ${width};
          transform: translateX(-${activeIndex * 100}%);
          transition: transform 500ms ease-in-out;
        `}
        className="carousel"
      >
        {children}
      </div>
    </div>
  );
};

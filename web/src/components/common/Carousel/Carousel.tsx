/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import * as React from 'react';

import { flexMixin } from 'src/styles/mixins';
import Link from 'next/link';
import { getPageHref } from 'src/helpers/link';

interface ICarouselItemProps {
  className?: string;
  children: React.ReactNode;
  asPath?: string | null;
}

export const CarouselItem = React.forwardRef<HTMLDivElement, ICarouselItemProps>(
  ({ children, className, asPath }, ref) => {
    const item = (
      <div
        className={classNames(className, 'carousel-item')}
        ref={ref}
        css={css`
          flex: 0 0 100%;
          position: relative;
          cursor: ${asPath ? 'pointer' : 'auto'};
        `}
      >
        {children}
      </div>
    );

    return asPath ? (
      <Link as={asPath} href={getPageHref(asPath)}>
        {item}
      </Link>
    ) : (
      item
    );
  },
);

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

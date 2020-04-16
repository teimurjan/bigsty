/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import * as React from 'react';

import { Carousel, CarouselItem } from 'src/components/common/Carousel/Carousel';
import { Image } from 'src/components/common/Image/Image';
import { mediaQueries } from 'src/styles/media';

const CONTROL_IMAGE_SIZE = '70px';

interface IProps {
  images: string[];
  activeImageIndex: number;
  setActiveImageIndex: (index: number) => void;
}

export const ProductTypeImageCarousel: React.FC<IProps> = ({ images, activeImageIndex, setActiveImageIndex }) => {
  const theme = useTheme<CSSThemeV2>();

  return (
    <div
      css={css`
        width: 100%;
      `}
    >
      <Carousel activeIndex={activeImageIndex}>
        {images.map(image => (
          <CarouselItem key={image}>
            <Image
              css={css`
                margin: auto;
                display: flex;
                height: 40vw;
                width: 40vw;

                @media ${mediaQueries.maxWidth768} {
                  width: 90vw;
                  height: 90vw;
                }
              `}
              imgProps={{ src: image, style: { margin: 'auto' }, alt: image }}
            />
          </CarouselItem>
        ))}
      </Carousel>
      <div
        css={css`
          height: ${CONTROL_IMAGE_SIZE};
          overflow: auto;
          display: flex;
          width: 40vw;
          margin: auto;

          @media ${mediaQueries.maxWidth768} {
            width: 90vw;
          }
        `}
      >
        {images.map(image => {
          const currentImageIndex = images.indexOf(image);
          const isActive = currentImageIndex === activeImageIndex;
          const onImageClick = () => setActiveImageIndex(currentImageIndex);

          return (
            <Image
              key={image}
              onClick={onImageClick}
              css={css`
                cursor: pointer;
                height: ${CONTROL_IMAGE_SIZE};
                width: ${CONTROL_IMAGE_SIZE};
                border: ${isActive ? `5px solid ${theme.primaryColor}` : 'unset'};
                margin-right: 10px;
                display: flex;
              `}
              imgProps={{ src: image, style: { margin: 'auto' }, alt: image }}
            />
          );
        })}
      </div>
    </div>
  );
};

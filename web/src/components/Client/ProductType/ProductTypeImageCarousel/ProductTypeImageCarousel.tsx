/** @jsx jsx */
import * as React from 'react';

import { css, jsx } from '@emotion/core';

import { Carousel, CarouselItem } from 'src/components/common/Carousel/Carousel';

import { Image } from 'src/components/common/Image/Image';
import { flexMixin } from 'src/styles/mixins';
import { useTheme } from 'emotion-theming';
import { ITheme } from 'src/themes';
import { mediaQueries } from 'src/styles/media';
import { useMedia } from 'src/hooks/useMedia';

const CONTROL_IMAGE_SIZE = '70px';

interface IProps {
  images: string[];
  activeImageIndex: number;
  setActiveImageIndex: (index: number) => void;
}

export const ProductTypeImageCarousel: React.FC<IProps> = ({ images, activeImageIndex, setActiveImageIndex }) => {
  const theme = useTheme<ITheme>();

  const imageSize = useMedia(
    [mediaQueries.minWidth1600, mediaQueries.minWidth2000, mediaQueries.maxWidth768],
    ['500px', '600px', '80vw'],
    '30vw',
  );

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
                height: ${imageSize};
                width: ${imageSize};
                margin: auto;
                ${flexMixin};
              `}
              imgProps={{ src: image, style: { margin: 'auto' } }}
            />
          </CarouselItem>
        ))}
      </Carousel>
      <div
        css={css`
          width: ${imageSize};
          height: ${CONTROL_IMAGE_SIZE};
          overflow: auto;
          ${flexMixin};
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
                border: ${isActive ? `3px solid ${theme.primary}` : 'unset'};
                margin-right: 10px;
                ${flexMixin};
              `}
              imgProps={{ src: image, style: { margin: 'auto' } }}
            />
          );
        })}
      </div>
    </div>
  );
};

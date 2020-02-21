/** @jsx jsx */
import * as React from 'react';

import { css, jsx } from '@emotion/core';

import { Carousel, CarouselItem } from 'src/components/common/Carousel/Carousel';

import { Image } from 'src/components/common/Image/Image';
import { flexMixin } from 'src/styles/mixins';
import { useTheme } from 'emotion-theming';
import { ITheme } from 'src/themes';

const CONTROL_IMAGE_SIZE = '70px';
const ACTIVE_IMAGE_SIZE = '30vw';

interface IProps {
  images: string[];
  activeImageIndex: number;
  setActiveImageIndex: (index: number) => void;
}

export const ProductTypeImageCarousel: React.FC<IProps> = ({ images, activeImageIndex, setActiveImageIndex }) => {
  const theme = useTheme<ITheme>();

  return (
    <div>
      <Carousel activeIndex={activeImageIndex}>
        {images.map(image => (
          <CarouselItem key={image}>
            <Image
              css={css`
                height: ${ACTIVE_IMAGE_SIZE};
                width: ${ACTIVE_IMAGE_SIZE};
              `}
              imgProps={{ src: image }}
            />
          </CarouselItem>
        ))}
      </Carousel>
      <div
        css={css`
          width: ${ACTIVE_IMAGE_SIZE};
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
              `}
              imgProps={{ src: image }}
            />
          );
        })}
      </div>
    </div>
  );
};

/** @jsx jsx */
import * as React from 'react';

import { css, jsx } from '@emotion/core';

import { Carousel, CarouselItem } from 'src/components/common/Carousel/Carousel';

import { IViewProps as IProps } from './HomePresenter';
import { triggerDimensionsCorrect } from 'src/hooks/useDimensions';
import { mediaQueries } from 'src/styles/media';
import { LinkButton } from 'src/components/common/LinkButton/LinkButton';
import { ProductTypesListView } from '../ProductType/ProductTypesList/ProductTypesListView';
import { Title } from 'src/components/common/Title/Title';
import { useIntl } from 'react-intl';
import { Subtitle } from 'src/components/common/Subtitle/Subtitle';

const preloadImage = (src: string) => {
  const image = new Image();
  image.src = src;
};

export const HomeView: React.FC<IProps> = ({ banners, productTypes }) => {
  const intl = useIntl();
  const [activeBannerIndex, setActiveBannerIndex] = React.useState(0);

  React.useEffect(() => {
    banners.forEach(banner => preloadImage(banner.image));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [banners.length]);

  React.useEffect(() => {
    const intervalID = setInterval(() => {
      const nextBannerIndex = activeBannerIndex < banners.length - 1 ? activeBannerIndex + 1 : 0;
      setActiveBannerIndex(nextBannerIndex);
    }, 5000);

    return () => clearInterval(intervalID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBannerIndex, banners.length]);

  return (
    <div
      css={css`
        padding-right: 1.5rem;

        @media ${mediaQueries.maxWidth768} {
          padding-right: 0;
        }
      `}
    >
      {banners.length > 0 && (
        <Carousel activeIndex={activeBannerIndex} fullWidth>
          {banners.map(banner => {
            const button = banner.link ? (
              <LinkButton
                css={css`
                  margin-top: -100px;
                `}
                color="is-primary"
                to={banner.link}
              >
                {banner.link_text}
              </LinkButton>
            ) : null;

            return (
              <CarouselItem
                key={banner.id}
                css={css`
                  width: 100%;
                `}
              >
                <img
                  css={css`
                    margin: auto;
                    display: block;
                  `}
                  onLoad={triggerDimensionsCorrect}
                  src={banner.image}
                />
                {button}
                <Title
                  className="has-text-white"
                  css={css`
                    position: absolute;
                    max-width: 60%;
                    top: ${banner.text_top_offset ? `${banner.text_top_offset}px` : undefined};
                    left: ${banner.text_left_offset ? `${banner.text_left_offset}px` : undefined};
                    right: ${banner.text_right_offset ? `${banner.text_right_offset}px` : undefined};
                    bottom: ${banner.text_bottom_offset ? `${banner.text_bottom_offset}px` : undefined};

                    @media ${mediaQueries.maxWidth768} {
                      max-width: 80%;
                      top: ${banner.text_top_offset ? `${banner.text_top_offset * 0.25}px` : undefined};
                      left: ${banner.text_left_offset ? `${banner.text_left_offset * 0.25}px` : undefined};
                      right: ${banner.text_right_offset ? `${banner.text_right_offset * 0.25}px` : undefined};
                      bottom: ${banner.text_bottom_offset ? `${banner.text_bottom_offset * 0.25}px` : undefined};
                    }
                  `}
                  size={1}
                >
                  {banner.text}
                </Title>
              </CarouselItem>
            );
          })}
        </Carousel>
      )}
      <Title
        css={css`
          margin-top: 1rem;
        `}
        size={3}
      >
        {intl.formatMessage({ id: 'common.newest' })}
      </Title>
      <ProductTypesListView productTypes={productTypes} isLoading={false} />
    </div>
  );
};

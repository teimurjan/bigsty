/** @jsx jsx */

import { css, jsx } from '@emotion/core';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { Transition } from 'react-transition-group';

import { IViewProps as IProps } from 'src/components/Client/Home/HomePresenter';
import { ProductTypesListView } from 'src/components/Client/ProductType/ProductTypesList/ProductTypesListView';
import { LinkButton } from 'src/components/common-v2/Button/Button';
import { Title } from 'src/components/common-v2/Title/Title';
import { Carousel, CarouselItem } from 'src/components/common/Carousel/Carousel';
import { Container } from 'src/components/common/Container/Container';
import { useMedia } from 'src/hooks/useMedia';
import { mediaQueries } from 'src/styles/media';

const getTextPositioningCSS = (banner: IProps['banners'][0]) => {
  const horizontalRule = banner.text_left_offset
    ? { key: 'left', value: banner.text_left_offset, tranlate: -banner.text_left_offset }
    : { key: 'right', value: banner.text_right_offset, tranlate: banner.text_right_offset };
  const verticalRule = banner.text_top_offset
    ? { key: 'top', value: banner.text_top_offset, tranlate: -banner.text_top_offset }
    : { key: 'bottom', value: banner.text_bottom_offset, tranlate: banner.text_bottom_offset };
  return `
    ${verticalRule.key}: ${verticalRule.value}%;
    ${horizontalRule.key}: ${horizontalRule.value}%;
    transform: translate(${horizontalRule.tranlate}%, ${verticalRule.tranlate}%);
  `;
};

export const HomeView: React.FC<IProps> = ({ banners, productTypes }) => {
  const intl = useIntl();
  const isMobile = useMedia([mediaQueries.maxWidth768], [true], false);
  const [activeBannerIndex, setActiveBannerIndex] = React.useState(0);

  React.useEffect(() => {
    const intervalID = setInterval(() => {
      const nextBannerIndex = activeBannerIndex < banners.length - 1 ? activeBannerIndex + 1 : 0;
      setActiveBannerIndex(nextBannerIndex);
    }, 5000);

    return () => clearInterval(intervalID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBannerIndex, banners.length]);

  return (
    <div>
      <Transition in={banners.length > 0} timeout={300}>
        {status => (
          <Carousel
            css={css`
              transition: max-height 1000ms;
              max-height: ${status === 'entering' || status === 'entered' ? '1000px' : '1px'};
              text-align: center;
            `}
            activeIndex={activeBannerIndex}
            fullWidth
          >
            {banners.map(banner => {
              const button =
                banner.link && banner.link_text ? (
                  <LinkButton color="light" href={banner.link}>
                    {banner.link_text}
                  </LinkButton>
                ) : null;

              return (
                <CarouselItem
                  key={banner.id}
                  css={css`
                    width: 100%;
                    min-height: 150px;
                    overflow: hidden;
                  `}
                >
                  <img
                    alt={banner.text}
                    css={css`
                      width: 100%;
                      display: block;
                      background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5));
                      transition: transform 300ms ease-in-out;
                      transform: scale(1);
                      transform-origin: 50% 50%;
                    `}
                    src={banner.image}
                  />
                  <div
                    css={css`
                      text-align: left;
                      position: absolute;
                      max-width: 60%;
                      ${getTextPositioningCSS(banner)}

                      @media ${mediaQueries.maxWidth768} {
                        max-width: 90%;
                      }
                    `}
                  >
                    {banner.text && (
                      <Title
                        css={css`
                          color: ${banner.text_color || '#fff'} !important;
                          font-weight: 500;
                          text-shadow: 0 1px 0 black;
                        `}
                        size={isMobile ? 3 : 1}
                      >
                        {banner.text}
                      </Title>
                    )}
                    {button}
                  </div>
                </CarouselItem>
              );
            })}
          </Carousel>
        )}
      </Transition>

      <Container>
        <Title
          css={css`
            margin-top: 1rem;
          `}
          size={3}
        >
          {intl.formatMessage({ id: 'common.newest' })}
        </Title>
      </Container>

      <ProductTypesListView productTypes={productTypes} isLoading={false} />
    </div>
  );
};

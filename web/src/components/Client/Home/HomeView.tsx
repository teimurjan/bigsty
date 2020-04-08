/** @jsx jsx */

import { css, jsx } from '@emotion/core';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { Transition } from 'react-transition-group';

import { IViewProps as IProps } from 'src/components/Client/Home/HomePresenter';
import { ProductTypesListView } from 'src/components/Client/ProductType/ProductTypesList/ProductTypesListView';
import { Carousel, CarouselItem } from 'src/components/common/Carousel/Carousel';
import { LinkButton } from 'src/components/common/LinkButton/LinkButton';
import { Title } from 'src/components/common/Title/Title';
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
  const [activeBannerIndex, setActiveBannerIndex] = React.useState(0);

  const titleSize = useMedia<2 | 1>([mediaQueries.maxWidth768], [2], 1);

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
                  <LinkButton
                    css={css`
                      margin-top: -80px;
                    `}
                    color="is-primary"
                    href={banner.link}
                  >
                    {banner.link_text}
                  </LinkButton>
                ) : null;

              return (
                <CarouselItem
                  key={banner.id}
                  asPath={banner.link_text ? undefined : banner.link}
                  css={css`
                    width: 100%;
                  `}
                >
                  <img
                    alt={banner.text}
                    css={css`
                      margin: auto;
                      display: block;
                      background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5));
                      transition: transform 300ms ease-in-out;
                      transform: scale(1);
                      transform-origin: 50% 50%;
                    `}
                    src={banner.image}
                  />
                  {button}
                  <Title
                    className="is-spaced"
                    css={css`
                    text-align: center;
                      position: absolute;
                      width: 60%;
                      color: ${banner.text_color || '#fff'} !important;
                      ${getTextPositioningCSS(banner)}

                      @media ${mediaQueries.maxWidth768} {
                        width: 90%;
                      }
                    `}
                    size={titleSize}
                  >
                    {banner.text}
                  </Title>
                </CarouselItem>
              );
            })}
          </Carousel>
        )}
      </Transition>

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

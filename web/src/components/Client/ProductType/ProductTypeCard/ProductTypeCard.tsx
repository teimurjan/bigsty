/** @jsx jsx */
import { css, jsx, keyframes } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import Link from 'next/link';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { IProductTypeListResponseItem } from 'src/api/ProductTypeAPI';
import { usePriceRangeText } from 'src/components/Client/Price/Price';
import { Button } from 'src/components/common-v2/Button/Button';
import { Subtitle } from 'src/components/common-v2/Subtitle/Subtitle';
import { Title } from 'src/components/common-v2/Title/Title';
import { Image } from 'src/components/common/Image/Image';
import { useIntersectionObserver } from 'src/hooks/useIntersectionObserver';
import { mediaQueries } from 'src/styles/media';
import { formatMediaURL } from 'src/utils/url';

export interface IProps {
  productType: IProductTypeListResponseItem;
}

const fadeIn = keyframes`
  0%   {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

const intersectionObserverOptions = {
  threshold: 0.3,
};

export const ProductTypeCard = ({ productType }: IProps) => {
  const theme = useTheme<CSSThemeV2>();
  const intl = useIntl();
  const asPath = `/products/${productType.id}`;
  const ref = React.useRef<HTMLAnchorElement>(null);
  const { hasIntersected } = useIntersectionObserver(ref, intersectionObserverOptions);
  const { price, discount } = usePriceRangeText({ range: productType.products || [] });

  return (
    <Link href="/products/[id]" as={asPath}>
      <a
        ref={ref}
        css={css`
          color: unset;
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          animation: ${hasIntersected
            ? css`
                ${fadeIn} 400ms cubic-bezier(0.61, 1, 0.88, 1);
              `
            : undefined};
          animation-fill-mode: forwards;
          opacity: 0;
        `}
      >
        <Image
          className="image is-square"
          imgProps={{ src: formatMediaURL(productType.image), alt: productType.name }}
        />
        <div
          css={css`
            display: flex;
            flex-direction: column;
            flex: 1;
            padding: 0 5px;
          `}
        >
          <Title
            css={css`
              margin-top: 10px;
            `}
            size={6}
          >
            {productType.name}
          </Title>
          <Subtitle
            css={css`
              margin-bottom: 20px;
              @media ${mediaQueries.maxWidth768} {
                margin-bottom: 10px;
              }
            `}
            size={6}
          >
            {productType.short_description}
          </Subtitle>
        </div>
        <Button
          css={css`
            width: 100%;
            margin-top: auto;
          `}
        >
          <span
            css={css`
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 0 15px;

              @media ${mediaQueries.maxWidth768} {
                flex-direction: column;
              }
            `}
          >
            <span>{intl.formatMessage({ id: 'common.buy' })}</span>
            {price && (
              <>
                <span
                  css={css`
                    &::after {
                      content: '|';
                    }

                    @media ${mediaQueries.maxWidth768} {
                      &::after {
                        content: '';
                        margin: 5px 0 2.5px 0;
                        height: 1px;
                        background: ${theme.borderColor};
                        width: 80px;
                        display: block;
                      }
                    }
                  `}
                ></span>
                <span
                  css={css`
                    @media ${mediaQueries.maxWidth768} {
                      font-size: 12px;
                    }
                  `}
                >
                  {price}
                </span>
              </>
            )}
          </span>
        </Button>
        {discount && (
          <div
            css={css`
              padding: 2.5px 5px;
              background-color: ${theme.primaryColor};
              color: ${theme.textOnPrimaryColor};
              position: absolute;
              top: 10px;
              right: 10px;
              font-weight: bold;
            `}
          >
            <small
              css={css`
                font-size: 12px;
              `}
            >
              {discount}
            </small>
          </div>
        )}
      </a>
    </Link>
  );
};

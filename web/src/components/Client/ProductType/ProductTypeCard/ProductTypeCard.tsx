/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { IProductTypeListResponseItem } from 'src/api/ProductTypeAPI';
import { Card } from 'src/components/common/Card/Card';
import { CardContent } from 'src/components/common/CardContent/CardContent';
import { CardImage } from 'src/components/common/CardImage/CardImage';
import { Image } from 'src/components/common/Image/Image';
import { Title } from 'src/components/common/Title/Title';
import { Subtitle } from 'src/components/common/Subtitle/Subtitle';
import { useIntl } from 'react-intl';
import { calculateDiscountedPrice } from 'src/utils/number';
import { mediaQueries } from 'src/styles/media';
import { LinkButton } from 'src/components/common/LinkButton/LinkButton';

export interface IProps {
  productType: IProductTypeListResponseItem;
}

const PriceText = ({ priceRange }: { priceRange: number[] }) => {
  const intl = useIntl();

  if (priceRange.length === 0) {
    return <Title size={5}>{intl.formatMessage({ id: 'common.notSpecified' })}</Title>;
  }

  return (
    <Title size={5}>
      {priceRange.length > 1 ? `${Math.min(...priceRange)}$ - ${Math.max(...priceRange)}$` : `${priceRange[0]}$`}
    </Title>
  );
};

export const ProductTypeCard = ({ productType }: IProps) => {
  const intl = useIntl();

  return (
    <Card
      css={css`
        height: 100%;
        display: flex;
        flex-direction: column;
      `}
    >
      <CardImage>
        <Image className="image is-square" imgProps={{ src: productType.image }} />
      </CardImage>
      <CardContent
        css={css`
          @media ${mediaQueries.maxWidth768} {
            padding: 0.5rem;
          }
        `}
      >
        <Subtitle size={5}>{productType.name}</Subtitle>
        {productType.products && (
          <PriceText
            priceRange={productType.products.map(product => calculateDiscountedPrice(product.price, product.discount))}
          />
        )}
      </CardContent>
      <LinkButton
        css={css`
          width: 100%;
          border-radius: unset;
          margin-top: auto;
        `}
        to={`/productTypes/${productType.id}`}
        color="is-primary"
      >
        {intl.formatMessage({ id: 'common.buy' })}
      </LinkButton>
    </Card>
  );
};

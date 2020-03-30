/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { IProductTypeListResponseItem } from 'src/api/ProductTypeAPI';
import { PriceRangeText } from 'src/components/Client/Price/Price';
import { Button } from 'src/components/common/Button/Button';
import { Card } from 'src/components/common/Card/Card';
import { CardContent } from 'src/components/common/CardContent/CardContent';
import { CardImage } from 'src/components/common/CardImage/CardImage';
import { Image } from 'src/components/common/Image/Image';
import { Subtitle } from 'src/components/common/Subtitle/Subtitle';
import { Title } from 'src/components/common/Title/Title';
import { mediaQueries } from 'src/styles/media';
import { formatMediaURL } from 'src/utils/url';


export interface IProps {
  productType: IProductTypeListResponseItem;
}

export const ProductTypeCard = ({ productType }: IProps) => {
  const intl = useIntl();

  return (
    <Link to={`/products/${productType.id}`}>
      <Card
        css={css`
          height: 100%;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

          &:hover {
            box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
          }
        `}
      >
        <CardImage>
          <Image
            className="image is-square"
            imgProps={{ src: formatMediaURL(productType.image), alt: productType.name }}
          />
        </CardImage>
        <CardContent
          css={css`
            @media ${mediaQueries.maxWidth768} {
              padding: 0.5rem;
            }
          `}
        >
          <Subtitle size={5}>{productType.name}</Subtitle>
          <Title size={5}>{productType.products && <PriceRangeText range={productType.products} />}</Title>
        </CardContent>
        <Button
          css={css`
            width: 100%;
            border-radius: unset;
            margin-top: auto;
          `}
          color="is-info"
        >
          {intl.formatMessage({ id: 'common.buy' })}
        </Button>
      </Card>
    </Link>
  );
};

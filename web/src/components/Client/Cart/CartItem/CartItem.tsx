/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';

import { IProductForCartResponseItem } from 'src/api/ProductAPI';
import { Quantity } from 'src/components/Client/Cart/CartItem/Quantity';
import { PriceCrossedText } from 'src/components/Client/Price/Price';
import { Subtitle } from 'src/components/common-v2/Subtitle/Subtitle';
import { Title } from 'src/components/common-v2/Title/Title';
import { Image } from 'src/components/common/Image/Image';

interface IProps {
  product: IProductForCartResponseItem;
  count: number;
  onRemoveClick: () => void;
  onAddClick: () => void;
}

export const CartItem = ({ product, count, onRemoveClick, onAddClick }: IProps) => {
  const theme = useTheme<CSSThemeV2>();

  return (
    <div
      css={css`
        padding: 10px 0;
        margin: 10px 0;
        border-bottom: 1px solid ${theme.borderColor};
      `}
    >
      <div
        css={css`
          display: flex;
        `}
      >
        <Image
          css={css`
            height: 50px;
            flex: 0 0 50px;
          `}
          imgProps={{
            src: product.images[0] || product.product_type.image,
            style: { margin: 'auto' },
            alt: product.product_type.name,
          }}
        />
        <div
          css={css`
            padding-left: 2rem;
          `}
        >
          <Title size={6}>{product.product_type.name}</Title>
          <Subtitle size={6}>{product.feature_values.map(featureValue => featureValue.name).join(', ')}</Subtitle>
        </div>
        <div
          css={css`
            margin-left: auto;
            text-align: right;
          `}
        >
          <Title
            css={css`
              del {
                color: ${theme.dangerColor};
              }
            `}
            size={6}
          >
            <PriceCrossedText price={product.price} discount={product.discount} />
          </Title>
        </div>
      </div>
      <Quantity count={count} allowedCount={product.quantity} onAddClick={onAddClick} onRemoveClick={onRemoveClick} />
    </div>
  );
};

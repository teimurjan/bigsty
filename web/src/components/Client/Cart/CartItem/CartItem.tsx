/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';

import { IProductForCartResponseItem } from 'src/api/ProductAPI';
import { Quantity } from 'src/components/Client/Cart/CartItem/Quantity';
import { PriceCrossedText } from 'src/components/Client/Price/Price';
import { Image } from 'src/components/common/Image/Image';
import { Subtitle } from 'src/components/common/Subtitle/Subtitle';
import { Title } from 'src/components/common/Title/Title';
import { ITheme } from 'src/themes';



interface IProps {
  product: IProductForCartResponseItem;
  count: number;
  onRemoveClick: () => void;
  onAddClick: () => void;
}

export const CartItem = ({ product, count, onRemoveClick, onAddClick }: IProps) => {
  const theme = useTheme<ITheme>();

  return (
    <div
      css={css`
        padding: 2rem 0;
      `}
    >
      <div
        css={css`
          display: flex;
        `}
      >
        <Image
          css={css`
            height: 100px;
            flex: 0 0 100px;
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
          <Title size={4}>{product.product_type.name}</Title>
          <Subtitle size={5}>{product.feature_values.map(featureValue => featureValue.name).join(', ')}</Subtitle>
        </div>
        <div
          css={css`
            margin-left: auto;
            text-align: right;
          `}
        >
          <Subtitle
            css={css`
              del {
                color: ${theme.danger};
              }
            `}
            size={3}
            className="has-text-dark"
          >
            <PriceCrossedText price={product.price} discount={product.discount} />
          </Subtitle>
        </div>
      </div>
      <Quantity count={count} allowedCount={product.quantity} onAddClick={onAddClick} onRemoveClick={onRemoveClick} />
    </div>
  );
};

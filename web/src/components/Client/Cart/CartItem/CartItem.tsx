/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useIntl } from 'react-intl';
import { useTheme } from 'emotion-theming';

import { IProductForCartResponseItem } from 'src/api/ProductAPI';
import { Image } from 'src/components/common/Image/Image';
import { Title } from 'src/components/common/Title/Title';
import { Subtitle } from 'src/components/common/Subtitle/Subtitle';
import { Button } from 'src/components/common/Button/Button';
import { ITheme } from 'src/themes';

import { PriceCrossedText } from '../../Price/Price';

interface IProps {
  product: IProductForCartResponseItem;
  count: number;
  onRemoveClick: () => void;
  onAddClick: () => void;
}

export const CartItem = ({ product, count, onRemoveClick, onAddClick }: IProps) => {
  const intl = useIntl();
  const theme = useTheme<ITheme>();

  return (
    <div
      css={css`
        display: flex;
        padding: 2rem;
      `}
    >
      <Image
        css={css`
          height: 100px;
          width: 100px;
          display: flex;
        `}
        imgProps={{ src: product.images[0], style: { margin: 'auto' } }}
      />
      <div
        css={css`
          padding-left: 2rem;
        `}
      >
        <Title size={4}>{product.product_type.name}</Title>
        <Subtitle size={5}>{product.feature_values.map(featureValue => featureValue.name).join(', ')}</Subtitle>
        {intl.formatMessage({ id: 'common.quantity' })}: {count}
        {count > product.quantity && (
          <small>{intl.formatMessage({ id: 'Cart.onlySomeAvailable' }, { quantity: product.quantity })}</small>
        )}
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

        <Button onClick={onRemoveClick}>{intl.formatMessage({ id: 'common.remove' })}</Button>
        <Button onClick={onAddClick}>{intl.formatMessage({ id: 'common.add' })}</Button>
      </div>
    </div>
  );
};

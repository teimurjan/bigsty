/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { IProductTypeListResponseItem } from 'src/api/ProductTypeAPI';
import { Card } from 'src/components/common/Card/Card';
import { CardContent } from 'src/components/common/CardContent/CardContent';
import { CardImage } from 'src/components/common/CardImage/CardImage';
import { Image } from 'src/components/common/Image/Image';
import { Title } from 'src/components/common/Title/Title';
import { fullWidthMixin } from 'src/styles/mixins';

export interface IProps {
  productType: IProductTypeListResponseItem;
}

export const ProductTypeCard = ({ productType }: IProps) => (
  <Card>
    <CardImage
      css={css`
        padding: 1.5rem;
      `}
    >
      <Image
        css={css`
          height: 300px;
          ${fullWidthMixin};
          position: relative;
          overflow: hidden;
        `}
        imgProps={{
          src: productType.image,
          style: { position: 'absolute', top: '50%', left: '50%', transform: 'translate3d(-50%, -50%, 0)' },
        }}
      />
    </CardImage>
    <CardContent>
      <Title size={4}>{productType.name}</Title>
    </CardContent>
  </Card>
);

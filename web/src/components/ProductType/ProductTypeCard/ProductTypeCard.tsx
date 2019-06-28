/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import { IProductTypeListResponseItem } from "src/api/ProductTypeAPI";
import { Card } from "src/components/common/Card/Card";
import { CardContent } from "src/components/common/CardContent/CardContent";
import { CardImage } from "src/components/common/CardImage/CardImage";
import { Image } from "src/components/common/Image/Image";
import { Title } from "src/components/common/Title/Title";
import { marginAutoMixin } from "src/styles/mixins";

export interface IProps {
  productType: IProductTypeListResponseItem;
}

export const ProductTypeCard = ({ productType }: IProps) => (
  <Card className="equal-height">
    <CardImage
      css={css`
        padding: 1.5rem;
      `}
    >
      <Image
        css={css`
          ${marginAutoMixin}
        `}
        className="is-3by4"
        imgProps={{ src: productType.image }}
      />
    </CardImage>
    <CardContent>
      <Title size={4}>{productType.name}</Title>
    </CardContent>
  </Card>
);

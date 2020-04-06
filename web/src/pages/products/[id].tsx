import * as React from 'react';
import { Then } from 'ttypes';

import { Layout } from 'src/components/Client/Layout';
import { ProductTypePageContainer } from 'src/components/Client/ProductTypePage/ProductTypePageContainer';
import { makeDependenciesContainer } from 'src/DI/DependenciesContainer';

export default ({ productType, products, error }: Then<ReturnType<typeof getServerSideProps>>['props']) => (
  <Layout>
    <ProductTypePageContainer initialProps={{ products, productType, error }} />
  </Layout>
);

export async function getServerSideProps({ params }: { params: { id: string } }) {
  const dependencies = makeDependenciesContainer();

  try {
    const productType = await dependencies.services.productType.getByID(parseInt(params.id, 10));
    const products = productType ? await dependencies.services.product.getForProductType(productType.id) : [];

    return {
      props: {
        productType,
        products,
      },
    };
  } catch (e) {
    return {
      props: {
        error: 'errors.common',
        productType: null,
        products: [],
      },
    };
  }
}

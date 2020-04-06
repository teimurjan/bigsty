import * as React from 'react';
import { Then } from 'ttypes';

import { Layout } from 'src/components/Client/Layout';
import { ProductTypesPageContainer } from 'src/components/Client/ProducTypesPage/ProductTypesPageContainer';
import { makeDependenciesContainer } from 'src/DI/DependenciesContainer';

export default ({
  productTypes,
  productTypesOrder,
  productTypesMeta,
  error,
}: Then<ReturnType<typeof getServerSideProps>>['props']) => (
  <Layout>
    <ProductTypesPageContainer initialProps={{ productTypes, productTypesOrder, productTypesMeta, error }} />
  </Layout>
);

export async function getServerSideProps({ params }: { params: { id: string } }) {
  const dependencies = makeDependenciesContainer();

  try {
    const { entities, meta, result } = await dependencies.services.productType.getForCategory(
      parseInt(params.id, 10),
      1,
    );

    return {
      props: {
        productTypes: entities.productTypes,
        productTypesMeta: meta,
        productTypesOrder: result,
      },
    };
  } catch (e) {
    return {
      props: {
        error: 'errors.common',
        productTypes: {},
        productTypesOrder: [],
        productTypesMeta: {
          count: 0,
          pages_count: 0,
          limit: 0,
          page: 0,
        },
      },
    };
  }
}

import * as React from 'react';

import { useDependencies } from 'src/DI/DI';

import { useAdminProductTypesState } from 'src/state/AdminProductTypesState';

import { DeleteModalContainer } from '../../DeleteModal/DeleteModalContainer';

export const AdminProductTypesDeleteContainer = () => {
  const { dependencies } = useDependencies();
  const {
    adminProductTypesState: { getProductTypes, deleteProductType },
  } = useAdminProductTypesState();

  const deleteEntity = React.useCallback(
    async (id: number) => {
      await dependencies.services.productType.delete(id);
      deleteProductType(id);
      getProductTypes();
    },
    [deleteProductType, dependencies.services.productType, getProductTypes],
  );

  const preloadData = React.useCallback(
    async ({ id, setError, setIsLoading }) => {
      try {
        setIsLoading(true);
        const isExists = await dependencies.services.productType.exists(id);
        if (!isExists) {
          setError('AdminProductTypes.notFound');
        }
      } catch (e) {
        setError('errors.common');
      } finally {
        setIsLoading(false);
      }
    },
    [dependencies.services.productType],
  );

  return <DeleteModalContainer deleteEntity={deleteEntity} preloadData={preloadData} backPath="/admin/productTypes" />;
};

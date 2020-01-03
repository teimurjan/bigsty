import * as React from 'react';

import { useDependencies } from 'src/DI/DI';

import { useAdminCategoriesState } from 'src/state/AdminCategoriesState';

import { DeleteModalContainer } from '../../DeleteModal/DeleteModalContainer';

export const AdminCategoriesDeleteContainer = () => {
  const { dependencies } = useDependencies();
  const {
    adminCategoriesState: { deleteCategory },
  } = useAdminCategoriesState();

  const deleteEntity = React.useCallback(
    async (id: number) => {
      await dependencies.services.category.delete(id);
      deleteCategory(id);
    },
    [deleteCategory, dependencies.services.category],
  );

  const preloadData = React.useCallback(
    async ({ id, setError, setIsLoading }) => {
      try {
        setIsLoading(true);
        const isExists = await dependencies.services.category.exists(id);
        if (!isExists) {
          setError('AdminCategories.notFound');
        }
      } catch (e) {
        setError('errors.common');
      } finally {
        setIsLoading(false);
      }
    },
    [dependencies.services.category],
  );

  return <DeleteModalContainer deleteEntity={deleteEntity} preloadData={preloadData} backPath="/admin/categorys" />;
};

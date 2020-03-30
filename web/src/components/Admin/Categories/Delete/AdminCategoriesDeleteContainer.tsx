import * as React from 'react';

import { useDependencies } from 'src/DI/DI';
import * as categoryService from 'src/services/CategoryService';
import { useAdminCategoriesState } from 'src/state/AdminCategoriesState';

import { DeleteModalContainer } from '../../DeleteModal/DeleteModalContainer';

const getErrorMessageID = (e: Error) => {
  if (e instanceof categoryService.errors.CategoryHasChildren) {
    return 'errors.categoryDeletion.hasChildren';
  }
  if (e instanceof categoryService.errors.CategoryHasProductTypes) {
    return 'errors.categoryDeletion.hasProductTypes';
  }

  return 'errors.common';
};

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

  return (
    <DeleteModalContainer
      getErrorMessageID={getErrorMessageID}
      deleteEntity={deleteEntity}
      preloadData={preloadData}
      backPath="/admin/categories"
    />
  );
};

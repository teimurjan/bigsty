import * as React from 'react';

import { injectDependencies } from 'src/DI/DI';

import { IDependenciesContainer } from 'src/DI/DependenciesContainer';
import {
  IContextValue as AdminCategoriesContextValue,
  injectAdminCategoriesState,
} from 'src/state/AdminCategoriesState';
import { DeleteModalContainer } from '../../DeleteModal/DeleteModalContainer';

export interface IProps extends AdminCategoriesContextValue {
  dependencies: IDependenciesContainer;
}

export const AdminCategoriesDeleteContainer = injectAdminCategoriesState(
  injectDependencies(({ dependencies, adminCategoriesState: { deleteCategory } }: IProps) => {
    const deleteEntity = React.useCallback(
      async (id: number) => {
        await deleteCategory(id);
        dependencies.services.category.delete(id);
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
    return <DeleteModalContainer deleteEntity={deleteEntity} preloadData={preloadData} backPath="/admin/categories" />;
  }),
);

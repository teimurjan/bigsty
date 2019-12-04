import * as React from 'react';

import { useDependencies } from 'src/DI/DI';

import { useAdminFeatureValuesState } from 'src/state/AdminFeatureValuesState';

import { DeleteModalContainer } from '../../DeleteModal/DeleteModalContainer';

export const AdminFeatureValuesDeleteContainer = () => {
  const { dependencies } = useDependencies();
  const {
    adminFeatureValuesState: { deleteFeatureValue },
  } = useAdminFeatureValuesState();

  const deleteEntity = React.useCallback(
    async (id: number) => {
      await deleteFeatureValue(id);
      dependencies.services.featureValue.delete(id);
    },
    [deleteFeatureValue, dependencies.services.featureValue],
  );

  const preloadData = React.useCallback(
    async ({ id, setError, setIsLoading }) => {
      try {
        setIsLoading(true);
        const isExists = await dependencies.services.featureValue.exists(id);
        if (!isExists) {
          setError('AdminFeatureValues.notFound');
        }
      } catch (e) {
        setError('errors.common');
      } finally {
        setIsLoading(false);
      }
    },
    [dependencies.services.featureValue],
  );

  return <DeleteModalContainer deleteEntity={deleteEntity} preloadData={preloadData} backPath="/admin/featureValues" />;
};

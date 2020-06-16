import * as React from 'react';

import { DeleteModalContainer } from 'src/components/Admin/DeleteModal/DeleteModalContainer';
import { useDependencies } from 'src/DI/DI';
import * as rateService from 'src/services/RateService';
import { useAdminRatesState } from 'src/state/AdminRatesState';

const getErrorMessageID = (e: Error) => {
  if (e instanceof rateService.errors.RateHasOrders) {
    return 'AdminRates.errors.hasOrders';
  }

  return 'errors.common';
};

export const AdminRatesDeleteContainer = () => {
  const { dependencies } = useDependencies();
  const {
    adminRatesState: { getRates, deleteRate },
  } = useAdminRatesState();

  const deleteEntity = React.useCallback(
    async (id: number) => {
      await dependencies.services.rate.delete(id);
      deleteRate(id);
      getRates();
    },
    [deleteRate, dependencies.services.rate, getRates],
  );

  const preloadData = React.useCallback(
    async ({ id, setError, setIsLoading }) => {
      try {
        setIsLoading(true);
        const isExists = await dependencies.services.rate.exists(id);
        if (!isExists) {
          setError('AdminRates.notFound');
        }
      } catch (e) {
        setError('errors.common');
      } finally {
        setIsLoading(false);
      }
    },
    [dependencies.services.rate],
  );

  return (
    <DeleteModalContainer
      getErrorMessageID={getErrorMessageID}
      deleteEntity={deleteEntity}
      preloadData={preloadData}
      backPath="/admin/rates"
    />
  );
};

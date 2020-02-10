import * as React from 'react';

import { IntlShape } from 'react-intl';

import { ModalForm } from '../../ModalForm';

import { IViewProps as IProps } from './AdminProductsCreatePresenter';
import { Fields } from './Fields';

export const AdminProductsCreateView = ({
  isOpen,
  create,
  close,
  isLoading,
  error,
  intl,
  validate,
  productTypes,
  preloadingError,
  isCreating,
  featureValues,
}: IProps & { intl: IntlShape }) => (
  <ModalForm
    formID="adminProductsCreateForm"
    isOpen={isOpen}
    onSubmit={create}
    onClose={close}
    isLoading={isCreating}
    isPreloading={isLoading}
    preloadingError={preloadingError}
    globalError={error}
    title={intl.formatMessage({ id: 'AdminProducts.create.title' })}
    fields={<Fields productTypes={productTypes} featureValues={featureValues} />}
    validate={validate}
    wide
  />
);

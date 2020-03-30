import * as React from 'react';
import { IntlShape } from 'react-intl';

import { ModalForm } from '../../ModalForm';

import { IViewProps as IProps } from './AdminFeatureValuesCreatePresenter';
import { Fields } from './Fields';

export const AdminFeatureValuesCreateView = ({
  isOpen,
  create,
  close,
  isCreating,
  isLoading,
  error,
  intl,
  availableLocales,
  featureTypes,
  validate,
}: IProps & { intl: IntlShape }) => (
  <ModalForm
    formID="adminFeatureValuesCreateForm"
    isOpen={isOpen}
    onSubmit={create}
    onClose={close}
    isLoading={isCreating}
    isPreloading={isLoading}
    globalError={error}
    title={intl.formatMessage({ id: 'AdminFeatureValues.create.title' })}
    fields={<Fields availableLocales={availableLocales} featureTypes={featureTypes} />}
    validate={validate}
  />
);

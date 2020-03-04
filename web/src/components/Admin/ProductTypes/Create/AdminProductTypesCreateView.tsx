import * as React from 'react';

import { IntlShape } from 'react-intl';

import { ModalForm } from '../../ModalForm';

import {
  PRODUCT_TYPE_NAME_FIELD_KEY,
  PRODUCT_TYPE_DESCRIPTION_FIELD_KEY,
  PRODUCT_TYPE_SHORT_DESCRIPTION_FIELD_KEY,
  IViewProps as IProps,
} from './AdminProductTypesCreatePresenter';
import { Fields } from './Fields';

export const AdminProductTypesCreateView = ({
  isOpen,
  create,
  close,
  isLoading,
  error,
  intl,
  availableLocales,
  validate,
  categories,
  preloadingError,
  isCreating,
  featureTypes,
  onChange,
  initialValues,
}: IProps & { intl: IntlShape }) => (
  <ModalForm
    formID="adminProductTypesCreateForm"
    isOpen={isOpen}
    onSubmit={create}
    onClose={close}
    isLoading={isCreating}
    isPreloading={isLoading}
    preloadingError={preloadingError}
    globalError={error}
    title={intl.formatMessage({ id: 'AdminProductTypes.create.title' })}
    fields={
      <Fields
        availableLocales={availableLocales}
        categories={categories}
        featureTypes={featureTypes}
        nameFieldKey={PRODUCT_TYPE_NAME_FIELD_KEY}
        descriptionFieldKey={PRODUCT_TYPE_DESCRIPTION_FIELD_KEY}
        shortDescriptionFieldKey={PRODUCT_TYPE_SHORT_DESCRIPTION_FIELD_KEY}
      />
    }
    onChange={onChange}
    validate={validate}
    initialValues={initialValues}
    wide
  />
);

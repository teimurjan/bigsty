import * as React from 'react';

import { IntlShape } from 'react-intl';

import { ModalForm } from '../../ModalForm';

import { IViewProps as IProps } from './AdminProductTypesEditPresenter';

import { Fields } from '../Create/Fields';
import {
  PRODUCT_TYPE_NAME_FIELD_KEY,
  PRODUCT_TYPE_DESCRIPTION_FIELD_KEY,
  PRODUCT_TYPE_SHORT_DESCRIPTION_FIELD_KEY,
} from '../Create/AdminProductTypesCreatePresenter';

export const AdminProductTypesEditView = ({
  isOpen,
  edit,
  close,
  isLoading,
  isUpdating,
  error,
  intl,
  availableLocales,
  validate,
  categories,
  preloadingError,
  initialValues,
  featureTypes,
}: IProps & { intl: IntlShape }) => (
  <ModalForm
    formID="adminProductTypesEditForm"
    isOpen={isOpen}
    onSubmit={edit}
    onClose={close}
    isPreloading={isLoading}
    isLoading={isUpdating}
    preloadingError={preloadingError}
    globalError={error}
    title={intl.formatMessage({ id: 'AdminProductTypes.edit.title' })}
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
    validate={validate}
    initialValues={initialValues}
    wide
  />
);

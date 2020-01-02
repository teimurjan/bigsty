import * as React from 'react';

import { IntlShape } from 'react-intl';

import { ModalForm } from '../../ModalForm';

import { CATEGORY_NAME_FIELD_KEY, IViewProps as IProps } from './AdminCategoriesCreatePresenter';
import { Fields } from './Fields';

export const AdminCategoriesCreateView = ({
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
}: IProps & { intl: IntlShape }) => (
  <ModalForm
    formID="adminCategoriesCreateForm"
    isOpen={isOpen}
    onSubmit={create}
    onClose={close}
    isLoading={isCreating}
    isPreloading={isLoading}
    preloadingError={preloadingError}
    globalError={error}
    title={intl.formatMessage({ id: 'AdminCategories.create.title' })}
    fields={
      <Fields availableLocales={availableLocales} categories={categories} nameFieldKey={CATEGORY_NAME_FIELD_KEY} />
    }
    validate={validate}
  />
);

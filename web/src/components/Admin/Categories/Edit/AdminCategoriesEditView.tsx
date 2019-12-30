import * as React from 'react';

import { IntlShape } from 'react-intl';

import { ModalForm } from '../../ModalForm';

import { CATEGORY_NAME_FIELD_KEY, IViewProps as IProps } from './AdminCategoriesEditPresenter';

import { Fields, IFieldsProps } from '../Create/Fields';

const getFieldsRenderer = (props: IFieldsProps) => () => <Fields {...props} />;

export const AdminCategoriesEditView = ({
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
}: IProps & { intl: IntlShape }) => (
  <ModalForm
    formID="adminCategoriesEditForm"
    isOpen={isOpen}
    onSubmit={edit}
    onClose={close}
    isPreloading={isLoading}
    isLoading={isUpdating}
    preloadingError={preloadingError}
    globalError={error}
    title={intl.formatMessage({ id: 'AdminCategories.edit.title' })}
    renderFields={getFieldsRenderer({
      availableLocales,
      categories,
      nameFieldKey: CATEGORY_NAME_FIELD_KEY,
    })}
    validate={validate}
    initialValues={initialValues}
  />
);

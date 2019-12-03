import * as React from 'react';

import { InjectedIntlProps, injectIntl } from 'react-intl';

import { ModalForm } from '../../ModalForm';

import { CATEGORY_NAME_FIELD_KEY, IViewProps as IProps } from './AdminCategoriesCreatePresenter';
import { Fields, IFieldsProps } from './Fields';

const getFieldsRenderer = (props: IFieldsProps) => () => <Fields {...props} />;

export const AdminCategoriesCreateView = injectIntl(
  ({
    isOpen,
    create,
    close,
    isLoading,
    error,
    intl,
    availableLocales,
    validate,
    featureTypes,
    categories,
    preloadingError,
    isCreating,
  }: IProps & InjectedIntlProps) => (
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
      renderFields={getFieldsRenderer({
        availableLocales,
        categories,
        featureTypes,
        nameFieldKey: CATEGORY_NAME_FIELD_KEY,
      })}
      validate={validate}
    />
  ),
);

import * as React from "react";

import { InjectedIntlProps, injectIntl } from "react-intl";

import { ModalForm } from "../../ModalForm";

import {
  CATEGORY_NAME_FIELD_KEY,
  IViewProps as IProps
} from "./AdminCategoriesEditPresenter";

import { Fields, IFieldsProps } from "../Create/Fields";

const getFieldsRenderer = (props: IFieldsProps) => () => <Fields {...props} />;

export const AdminCategoriesEditView = injectIntl(
  ({
    isOpen,
    edit,
    close,
    isLoading,
    isUpdating,
    error,
    intl,
    availableLocales,
    validate,
    featureTypes,
    categories,
    preloadingError,
    initialValues
  }: IProps & InjectedIntlProps) => (
    <ModalForm
      formID="adminCategoriesEditForm"
      isOpen={isOpen}
      onSubmit={edit}
      onClose={close}
      isPreloading={isLoading}
      isLoading={isUpdating}
      preloadingError={preloadingError}
      globalError={error}
      title={intl.formatMessage({ id: "AdminCategories.edit.title" })}
      renderFields={getFieldsRenderer({
        availableLocales,
        categories,
        featureTypes,
        nameFieldKey: CATEGORY_NAME_FIELD_KEY
      })}
      validate={validate}
      initialValues={initialValues}
    />
  )
);

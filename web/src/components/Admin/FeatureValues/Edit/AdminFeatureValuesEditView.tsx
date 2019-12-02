import * as React from "react";

import { InjectedIntlProps } from "react-intl";

import { ModalForm } from "../../ModalForm";
import { Fields, IFieldsProps } from "../Create/Fields";

import { IViewProps as IProps } from "./AdminFeatureValuesEditPresenter";

const getFieldsRenderer = (props: IFieldsProps) => () => <Fields {...props} />;

export const AdminFeatureValuesEditView = ({
  isOpen,
  edit,
  close,
  isLoading,
  isUpdating,
  error,
  intl,
  initialValues,
  availableLocales,
  validate,
  preloadingError,
  featureTypes
}: IProps & InjectedIntlProps) => (
  <ModalForm
    formID="adminFeatureValuesEditForm"
    isOpen={isOpen}
    onSubmit={edit}
    onClose={close}
    isLoading={isUpdating}
    isPreloading={isLoading}
    globalError={error}
    title={intl.formatMessage({ id: "AdminFeatureValues.edit.title" })}
    renderFields={getFieldsRenderer({ availableLocales, featureTypes })}
    validate={validate}
    initialValues={initialValues}
    preloadingError={preloadingError}
  />
);

import * as React from "react";

import { Field, FieldRenderProps } from "react-final-form";
import { InjectedIntl, InjectedIntlProps, injectIntl } from "react-intl";

import { FormTextField } from "src/components/common/FormTextField/FormTextField";

import { CreateModal } from "../../CreateModal";

import { Tag } from "src/components/common/Tag/Tag";
import { IViewProps as IProps } from "./AdminFeatureTypesCreatePresenter";

const getIntlFieldRenderer = (
  locale: IProps["availableLocales"][0],
  intl: InjectedIntl
) => ({ input, meta }: FieldRenderProps) => {
  const showError = meta.touched && meta.error;
  return (
    <FormTextField
      labelProps={{
        children: (
          <>
            {intl.formatMessage({
              id: "AdminFeatureTypes.nameInput.label"
            })}{" "}
            <Tag color="is-info">{locale.name}</Tag>
          </>
        )
      }}
      inputProps={{
        ...input,
        isDanger: showError,
        placeholder: intl.formatMessage({
          id: "AdminFeatureTypes.nameInput.placeholder"
        }),
        type: "text"
      }}
      helpTextProps={{
        children: showError
          ? intl.formatMessage({ id: meta.error })
          : undefined,
        type: "is-danger"
      }}
    />
  );
};

const getFieldsRenderer = (
  availableLocales: IProps["availableLocales"],
  getFieldName: IProps["getFieldName"],
  intl: InjectedIntl
) => () => (
  <>
    {availableLocales.map(locale => (
      <Field
        key={locale.id}
        name={getFieldName(locale)}
        render={getIntlFieldRenderer(locale, intl)}
      />
    ))}
  </>
);

export const AdminFeatureTypesCreateView = injectIntl(
  ({
    isOpen,
    create,
    close,
    isLoading,
    error,
    intl,
    availableLocales,
    validate,
    getFieldName
  }: IProps & InjectedIntlProps) => (
    <CreateModal
      formID="adminFeatureTypesCreateForm"
      isOpen={isOpen}
      onSubmit={create}
      onClose={close}
      isLoading={isLoading}
      globalError={error}
      title={intl.formatMessage({ id: "AdminFeatureTypes.create.title" })}
      renderFields={getFieldsRenderer(availableLocales, getFieldName, intl)}
      validate={validate}
    />
  )
);

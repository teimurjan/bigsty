import * as React from "react";

import { Field, FieldRenderProps } from "react-final-form";
import { InjectedIntlProps, injectIntl } from "react-intl";

import { CreateModal } from "../../CreateModal";

import { FormNativeSelectField } from "src/components/common/FormNativeSelectField/FormNativeSelectField";
import { getMultipleValuesFromChangeEvent } from "src/components/common/NativeSelect/NativeSelect";

import { IntlField } from "../../IntlField";

import {
  CATEGORY_NAME_FIELD_KEY,
  IViewProps as IProps
} from "./AdminCategoriesCreatePresenter";

interface IFeatureTypesSelectProps extends FieldRenderProps {
  featureTypes: IProps["featureTypes"];
}

const FeatureTypesSelect = injectIntl(
  ({
    featureTypes,
    intl,
    input,
    meta
  }: IFeatureTypesSelectProps & InjectedIntlProps) => {
    const showError = meta.touched && meta.error;

    const { onChange: _, value, ...inputPropsToPass } = input;

    const onChange = React.useCallback(
      (e: React.SyntheticEvent<HTMLSelectElement>) => {
        input.onChange(getMultipleValuesFromChangeEvent(e));
      },
      []
    );

    return (
      <FormNativeSelectField
        labelProps={{
          children: (
            <>
              {intl.formatMessage({
                id: "AdminCategories.featureTypesSelect.label"
              })}
            </>
          )
        }}
        selectProps={{
          ...inputPropsToPass,
          isMultiple: true,
          onChange,
          options: featureTypes.map(({ id, name }) => ({
            title: name[intl.locale],
            value: `${id}`
          })),
          value
        }}
        helpTextProps={{
          children: showError
            ? intl.formatMessage({ id: meta.error })
            : undefined,
          type: "is-danger"
        }}
      />
    );
  }
);

interface IParentCategorySelectProps extends FieldRenderProps {
  categories: IProps["categories"];
}

const ParentCategorySelect = injectIntl(
  ({
    categories,
    intl,
    input,
    meta
  }: IParentCategorySelectProps & InjectedIntlProps) => {
    const showError = meta.touched && meta.error;

    return (
      <FormNativeSelectField
        labelProps={{
          children: (
            <>
              {intl.formatMessage({
                id: "AdminCategories.parentCategorySelect.label"
              })}
            </>
          )
        }}
        selectProps={{
          ...input,
          defaultOption: {
            title: intl.formatMessage({
              id: "AdminCategories.parentCategorySelect.defaultOption.title"
            })
          },
          options: categories.map(({ id, name }) => ({
            title: name[intl.locale],
            value: `${id}`
          }))
        }}
        helpTextProps={{
          children: showError
            ? intl.formatMessage({ id: meta.error })
            : undefined,
          type: "is-danger"
        }}
      />
    );
  }
);

const getFeatureTypesRenderer = (featureTypes: IProps["featureTypes"]) => (
  fieldRenderProps: FieldRenderProps
) => <FeatureTypesSelect featureTypes={featureTypes} {...fieldRenderProps} />;

const getParentCategoryIDRenderer = (categories: IProps["categories"]) => (
  fieldRenderProps: FieldRenderProps
) => <ParentCategorySelect categories={categories} {...fieldRenderProps} />;

interface IFieldsProps {
  featureTypes: IProps["featureTypes"];
  categories: IProps["categories"];
  availableLocales: IProps["availableLocales"];
}

const Fields = injectIntl(
  ({
    availableLocales,
    featureTypes,
    categories,
    intl
  }: IFieldsProps & InjectedIntlProps) => (
    <>
      <IntlField
        key_={CATEGORY_NAME_FIELD_KEY}
        locales={availableLocales}
        label={intl.formatMessage({
          id: "AdminCategories.nameInput.label"
        })}
        placeholder={intl.formatMessage({
          id: "AdminCategories.nameInput.placeholder"
        })}
      />
      <Field
        key="feature_types"
        name="feature_types"
        render={getFeatureTypesRenderer(featureTypes)}
      />
      <Field
        key="parent_category_id"
        name="parent_category_id"
        render={getParentCategoryIDRenderer(categories)}
      />
    </>
  )
);

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
    categories
  }: IProps & InjectedIntlProps) => (
    <CreateModal
      formID="adminCategoriesCreateForm"
      isOpen={isOpen}
      onSubmit={create}
      onClose={close}
      isLoading={isLoading}
      globalError={error}
      title={intl.formatMessage({ id: "AdminCategories.create.title" })}
      renderFields={getFieldsRenderer({
        availableLocales,
        categories,
        featureTypes
      })}
      validate={validate}
    />
  )
);

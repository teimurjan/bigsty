import * as React from 'react';

import { Field, FieldRenderProps } from 'react-final-form';
import { IntlShape, injectIntl } from 'react-intl';

import { FormNativeSelectField } from 'src/components/common/FormNativeSelectField/FormNativeSelectField';
import { getMultipleValuesFromChangeEvent } from 'src/components/common/NativeSelect/NativeSelect';

import { IContextValue as AdminCategoriesStateContextValue } from 'src/state/AdminCategoriesState';
import { IContextValue as AdminFeatureTypesStateContextValue } from 'src/state/AdminFeatureTypesState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

import { IntlField } from '../../IntlField';

interface IFeatureTypesSelectProps extends FieldRenderProps {
  featureTypes: AdminFeatureTypesStateContextValue['adminFeatureTypesState']['featureTypes'];
}

const FeatureTypesSelect = injectIntl(
  ({ featureTypes, intl, input, meta }: IFeatureTypesSelectProps & { intl: IntlShape }) => {
    const showError = meta.touched && meta.error;

    const { onChange: _, value, ...inputPropsToPass } = input;

    const onChange = React.useCallback(
      (e: React.SyntheticEvent<HTMLSelectElement>) => {
        input.onChange(getMultipleValuesFromChangeEvent(e));
      },
      [input],
    );

    return (
      <FormNativeSelectField
        labelProps={{
          children: (
            <>
              {intl.formatMessage({
                id: 'AdminCategories.featureTypesSelect.label',
              })}
            </>
          ),
        }}
        selectProps={{
          ...inputPropsToPass,
          isMultiple: true,
          onChange,
          options: featureTypes.map(({ id, name }) => ({
            checked: value instanceof Array ? value.indexOf(id.toString()) !== -1 : false,
            title: name[intl.locale],
            value: id.toString(),
          })),
          value,
        }}
        helpTextProps={{
          children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
          type: 'is-danger',
        }}
      />
    );
  },
);

interface IParentCategorySelectProps extends FieldRenderProps {
  categories: AdminCategoriesStateContextValue['adminCategoriesState']['categories'];
}

const ParentCategorySelect = injectIntl(
  ({ categories, intl, input, meta }: IParentCategorySelectProps & { intl: IntlShape }) => {
    const showError = meta.touched && meta.error;

    return (
      <FormNativeSelectField
        labelProps={{
          children: (
            <>
              {intl.formatMessage({
                id: 'AdminCategories.parentCategorySelect.label',
              })}
            </>
          ),
        }}
        selectProps={{
          ...input,
          defaultOption: {
            title: intl.formatMessage({
              id: 'AdminCategories.parentCategorySelect.defaultOption.title',
            }),
          },
          options: categories.map(({ id, name }) => ({
            title: name[intl.locale],
            value: `${id}`,
          })),
        }}
        helpTextProps={{
          children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
          type: 'is-danger',
        }}
      />
    );
  },
);

const getFeatureTypesRenderer = (
  featureTypes: AdminFeatureTypesStateContextValue['adminFeatureTypesState']['featureTypes'],
) => (fieldRenderProps: FieldRenderProps) => <FeatureTypesSelect featureTypes={featureTypes} {...fieldRenderProps} />;

const getParentCategoryIDRenderer = (
  categories: AdminCategoriesStateContextValue['adminCategoriesState']['categories'],
) => (fieldRenderProps: FieldRenderProps) => <ParentCategorySelect categories={categories} {...fieldRenderProps} />;

export interface IFieldsProps {
  availableLocales: IntlStateContextValue['intlState']['availableLocales'];
  featureTypes: AdminFeatureTypesStateContextValue['adminFeatureTypesState']['featureTypes'];
  categories: AdminCategoriesStateContextValue['adminCategoriesState']['categories'];
  nameFieldKey: string;
}

export const Fields = injectIntl(
  ({ availableLocales, featureTypes, categories, intl, nameFieldKey }: IFieldsProps & { intl: IntlShape }) => (
    <>
      <IntlField
        key_={nameFieldKey}
        locales={availableLocales}
        label={intl.formatMessage({
          id: 'AdminCategories.nameInput.label',
        })}
        placeholder={intl.formatMessage({
          id: 'AdminCategories.nameInput.placeholder',
        })}
      />
      <Field key="feature_types" name="feature_types" render={getFeatureTypesRenderer(featureTypes)} />
      <Field key="parent_category_id" name="parent_category_id" render={getParentCategoryIDRenderer(categories)} />
    </>
  ),
);

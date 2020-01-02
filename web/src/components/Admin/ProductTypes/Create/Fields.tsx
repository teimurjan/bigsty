import * as React from 'react';

import { Field as FinalFormField, FieldRenderProps } from 'react-final-form';
import { IntlShape, injectIntl } from 'react-intl';

import { FormNativeSelectField } from 'src/components/common/FormNativeSelectField/FormNativeSelectField';

import { IContextValue as AdminCategoriesStateContextValue } from 'src/state/AdminCategoriesState';
import { IContextValue as AdminFeatureTypesStateContextValue } from 'src/state/AdminFeatureTypesState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

import { IntlField } from '../../IntlField';
import { getMultipleValuesFromChangeEvent } from 'src/components/common/NativeSelect/NativeSelect';
import { FileInput } from 'src/components/common/FileInput/FileInput';
import { Field } from 'src/components/common/Field/Field';
import { Label } from 'src/components/common/Label/Label';
import { HelpText } from 'src/components/common/HelpText/HelpText';

interface IFeatureTypesSelectProps extends FieldRenderProps<string[]> {
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
                id: 'AdminProductTypes.featureTypesSelect.label',
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

const getFeatureTypesSelectRenderer = (
  featureTypes: AdminFeatureTypesStateContextValue['adminFeatureTypesState']['featureTypes'],
) => (fieldRenderProps: FieldRenderProps<string[]>) => (
  <FeatureTypesSelect featureTypes={featureTypes} {...fieldRenderProps} />
);

interface ICategorySelectProps extends FieldRenderProps<string> {
  categories: AdminCategoriesStateContextValue['adminCategoriesState']['categories'];
}

const CategorySelect = injectIntl(({ categories, intl, input, meta }: ICategorySelectProps & { intl: IntlShape }) => {
  const showError = meta.touched && meta.error;

  return (
    <FormNativeSelectField
      labelProps={{
        children: (
          <>
            {intl.formatMessage({
              id: 'AdminProductTypes.categorySelect.label',
            })}
          </>
        ),
      }}
      selectProps={{
        ...input,
        defaultOption: {
          title: intl.formatMessage({
            id: 'AdminProductTypes.categorySelect.defaultOption.title',
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
});

const getCategorySelectRenderer = (
  categories: AdminCategoriesStateContextValue['adminCategoriesState']['categories'],
) => (fieldRenderProps: FieldRenderProps<string>) => <CategorySelect categories={categories} {...fieldRenderProps} />;

const getImageFieldRenderer = () =>
  injectIntl(({ input, meta, intl }: FieldRenderProps<File> & { intl: IntlShape }) => {
    const showError = meta.touched && meta.error;

    return (
      <Field>
        <Label>{intl.formatMessage({ id: 'AdminProductTypes.image' })}</Label>
        <FileInput
          {...input}
          accept="image/*"
          placeholder={intl.formatMessage({
            id: 'common.chooseImage',
          })}
        />
        <HelpText type="is-danger">{showError ? intl.formatMessage({ id: meta.error }) : undefined}</HelpText>
      </Field>
    );
  });

export interface IFieldsProps {
  availableLocales: IntlStateContextValue['intlState']['availableLocales'];
  categories: AdminCategoriesStateContextValue['adminCategoriesState']['categories'];
  featureTypes: AdminFeatureTypesStateContextValue['adminFeatureTypesState']['featureTypes'];
  nameFieldKey: string;
  descriptionFieldKey: string;
  shortDescriptionFieldKey: string;
}

export const Fields = injectIntl(
  ({
    availableLocales,
    categories,
    featureTypes,
    intl,
    nameFieldKey,
    descriptionFieldKey,
    shortDescriptionFieldKey,
  }: IFieldsProps & { intl: IntlShape }) => (
    <>
      <IntlField
        key_={nameFieldKey}
        locales={availableLocales}
        label={intl.formatMessage({
          id: 'AdminProductTypes.nameInput.label',
        })}
        placeholder={intl.formatMessage({
          id: 'AdminProductTypes.nameInput.placeholder',
        })}
      />
      <IntlField
        key_={descriptionFieldKey}
        locales={availableLocales}
        label={intl.formatMessage({
          id: 'AdminProductTypes.descriptionInput.label',
        })}
        placeholder={intl.formatMessage({
          id: 'AdminProductTypes.descriptionInput.placeholder',
        })}
      />
      <IntlField
        key_={shortDescriptionFieldKey}
        locales={availableLocales}
        label={intl.formatMessage({
          id: 'AdminProductTypes.shortDescriptionInput.label',
        })}
        placeholder={intl.formatMessage({
          id: 'AdminProductTypes.shortDescriptionInput.placeholder',
        })}
      />
      <FinalFormField key="category_id" name="category_id" render={getCategorySelectRenderer(categories)} />
      <FinalFormField key="feature_types" name="feature_types" render={getFeatureTypesSelectRenderer(featureTypes)} />
      <FinalFormField key="image" name="image" render={getImageFieldRenderer()} />
    </>
  ),
);

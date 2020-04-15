import * as React from 'react';
import { Field as FinalFormField, FieldRenderProps } from 'react-final-form';
import { IntlShape, injectIntl } from 'react-intl';

import { IntlField, IProps as IIntlFieldProps } from 'src/components/Admin/IntlField';
import { Field } from 'src/components/common/Field/Field';
import { FileInput } from 'src/components/common/FileInput/FileInput';
import { FormNativeSelectField } from 'src/components/common/FormNativeSelectField/FormNativeSelectField';
import { FormTextField } from 'src/components/common/FormTextField/FormTextField';
import { HelpText } from 'src/components/common/HelpText/HelpText';
import { Label } from 'src/components/common/Label/Label';
import { getMultipleValuesFromChangeEvent } from 'src/components/common/NativeSelect/NativeSelect';
import { Tag } from 'src/components/common/Tag/Tag';
import { WYSIWYG } from 'src/components/common/WYSIWYG/WYSIWYG';
import { IContextValue as AdminCategoriesStateContextValue } from 'src/state/AdminCategoriesState';
import { IContextValue as AdminFeatureTypesStateContextValue } from 'src/state/AdminFeatureTypesState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';
import { arePropsEqual, lengthCompare } from 'src/utils/propEquality';

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
              id: 'common.category',
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

const renderDescriptionField: IIntlFieldProps['render'] = ({ input, meta, label, placeholder, locale, intl }) => {
  const showError = meta.touched && meta.error;

  return (
    <FormTextField
      labelProps={{
        children: (
          <>
            {label} <Tag color="is-primary">{locale.name}</Tag>
          </>
        ),
      }}
      renderInput={() => (
        <WYSIWYG
          initialValue={input.value}
          placeholder={placeholder}
          onChange={input.onChange}
          onBlur={input.onBlur}
          onFocus={input.onFocus}
          hasError={showError}
        />
      )}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
    />
  );
};

export interface IFieldsProps {
  availableLocales: IntlStateContextValue['intlState']['availableLocales'];
  categories: AdminCategoriesStateContextValue['adminCategoriesState']['categories'];
  featureTypes: AdminFeatureTypesStateContextValue['adminFeatureTypesState']['featureTypes'];
  nameFieldKey: string;
  descriptionFieldKey: string;
  shortDescriptionFieldKey: string;
}

export const Fields: React.SFC<IFieldsProps> = injectIntl<
  'intl',
  IFieldsProps & {
    intl: IntlShape;
  }
>(
  React.memo(
    ({
      availableLocales,
      categories,
      featureTypes,
      intl,
      nameFieldKey,
      descriptionFieldKey,
      shortDescriptionFieldKey,
    }) => (
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
          render={renderDescriptionField}
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
    (prevProps, nextProps) =>
      arePropsEqual(prevProps, nextProps, [
        'nameFieldKey',
        'descriptionFieldKey',
        'shortDescriptionFieldKey',
        { key: 'availableLocales', compare: lengthCompare },
        { key: 'categories', compare: lengthCompare },
        { key: 'featureTypes', compare: lengthCompare },
      ]),
  ),
);

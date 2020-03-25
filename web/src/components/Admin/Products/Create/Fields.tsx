/** @jsx jsx */
import * as React from 'react';

import { jsx, css } from '@emotion/core';

import { Field as FinalFormField, FieldRenderProps, useFormState } from 'react-final-form';
import { IntlShape, injectIntl, useIntl } from 'react-intl';
import difference from 'lodash/difference';

import { FormNativeSelectField } from 'src/components/common/FormNativeSelectField/FormNativeSelectField';

import { IContextValue as AdminFeatureValuesStateContextValue } from 'src/state/AdminFeatureValuesState';
import { IContextValue as AdminProductTypesStateContextValue } from 'src/state/AdminProductTypesState';

import { FileInput } from 'src/components/common/FileInput/FileInput';
import { Field } from 'src/components/common/Field/Field';
import { Label } from 'src/components/common/Label/Label';
import { HelpText } from 'src/components/common/HelpText/HelpText';
import { arePropsEqual, lengthCompare } from 'src/utils/propEquality';
import { FormRadioGroupField } from 'src/components/common/FormRadioGroupField/FormRadioGroupField';
import { IFeatureValueListRawIntlResponseItem } from 'src/api/FeatureValueAPI';
import { FormTextField } from 'src/components/common/FormTextField/FormTextField';
import { isAllowedForNumberInput } from 'src/utils/number';
import { Button } from 'src/components/common/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const renderQuantityField = injectIntl(({ input, meta, intl }: FieldRenderProps<string> & { intl: IntlShape }) => {
  const showError = meta.touched && meta.error;

  return (
    <FormTextField
      labelProps={{
        children: intl.formatMessage({ id: 'AdminProducts.quantity' }),
      }}
      inputProps={{
        ...input,
        isDanger: showError,
        placeholder: intl.formatMessage({
          id: 'AdminProducts.quantity',
        }),
        type: 'number',
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
      allowValue={isAllowedForNumberInput}
    />
  );
});

const renderUPCField = injectIntl(({ input, meta, intl }: FieldRenderProps<string> & { intl: IntlShape }) => {
  const showError = meta.touched && meta.error;

  return (
    <FormTextField
      labelProps={{
        children: intl.formatMessage({ id: 'AdminProducts.upc' }),
      }}
      inputProps={{
        ...input,
        isDanger: showError,
        placeholder: intl.formatMessage({
          id: 'AdminProducts.upc',
        }),
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
      allowValue={isAllowedForNumberInput}
    />
  );
});

const renderSKUField = injectIntl(({ input, meta, intl }: FieldRenderProps<string> & { intl: IntlShape }) => {
  const showError = meta.touched && meta.error;

  return (
    <FormTextField
      labelProps={{
        children: intl.formatMessage({ id: 'AdminProducts.sku' }),
      }}
      inputProps={{
        ...input,
        isDanger: showError,
        placeholder: intl.formatMessage({
          id: 'AdminProducts.sku',
        }),
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
    />
  );
});

const renderDiscountField = injectIntl(({ input, meta, intl }: FieldRenderProps<string> & { intl: IntlShape }) => {
  const showError = meta.touched && meta.error;

  return (
    <FormTextField
      labelProps={{
        children: intl.formatMessage({ id: 'AdminProducts.discount' }),
      }}
      inputProps={{
        ...input,
        isDanger: showError,
        placeholder: intl.formatMessage({
          id: 'AdminProducts.discount',
        }),
        type: 'number',
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
      allowValue={isAllowedForNumberInput}
    />
  );
});

const renderPriceField = injectIntl(({ input, meta, intl }: FieldRenderProps<string> & { intl: IntlShape }) => {
  const showError = meta.touched && meta.error;

  return (
    <FormTextField
      labelProps={{
        children: intl.formatMessage({ id: 'AdminProducts.price' }),
      }}
      inputProps={{
        ...input,
        isDanger: showError,
        placeholder: intl.formatMessage({
          id: 'AdminProducts.price',
        }),
        type: 'number',
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
      allowValue={isAllowedForNumberInput}
    />
  );
});

const useGroupedFeatureValuesByFeatureType = (
  featureValues: AdminFeatureValuesStateContextValue['adminFeatureValuesState']['featureValues'],
): { [key: string]: IFeatureValueListRawIntlResponseItem[] } => {
  const intl = useIntl();

  return featureValues.reduce((acc, featureValue) => {
    const group = acc[featureValue.feature_type.name[intl.locale]] || [];
    return { ...acc, [featureValue.feature_type.name[intl.locale]]: [...group, featureValue] };
  }, {});
};

interface IFeatureValuesSelectProps extends FieldRenderProps<string[]> {
  featureValues: AdminFeatureValuesStateContextValue['adminFeatureValuesState']['featureValues'];
}

const FeatureValuesSelect = injectIntl(
  ({ featureValues, intl, input, meta }: IFeatureValuesSelectProps & { intl: IntlShape }) => {
    const showError = meta.touched && meta.error;

    const groupedFeatureValues = useGroupedFeatureValuesByFeatureType(featureValues);

    return (
      <React.Fragment>
        {Object.keys(groupedFeatureValues).map(featureTypeName => (
          <FormRadioGroupField
            key={featureTypeName}
            labelProps={{ children: featureTypeName }}
            fieldProps={{
              onBlur: input.onBlur,
              onFocus: input.onFocus,
            }}
            radioPropsList={groupedFeatureValues[featureTypeName].map(({ id, name }) => ({
              key: id.toString(),
              checked: input.value instanceof Array ? input.value.indexOf(id.toString()) !== -1 : false,
              label: name[intl.locale],
              value: id.toString(),
              onChange: e => {
                const valueWithoutCurrentGroup = difference(
                  input.value,
                  groupedFeatureValues[featureTypeName].map(({ id }) => id.toString()),
                );
                input.onChange(
                  e.currentTarget.checked ? [...valueWithoutCurrentGroup, id.toString()] : valueWithoutCurrentGroup,
                );
              },
            }))}
          />
        ))}
        <HelpText type="is-danger">{showError ? intl.formatMessage({ id: meta.error }) : undefined}</HelpText>
      </React.Fragment>
    );
  },
);

const getFeatureValuesSelectRenderer = (
  featureValues: AdminFeatureValuesStateContextValue['adminFeatureValuesState']['featureValues'],
) => (fieldRenderProps: FieldRenderProps<string[]>) => {
  return <FeatureValuesSelect featureValues={featureValues} {...fieldRenderProps} />;
};

interface IProductTypeSelectProps extends FieldRenderProps<string> {
  categories: AdminProductTypesStateContextValue['adminProductTypesState']['productTypes'];
}

const ProductTypeSelect = injectIntl(
  ({ categories, intl, input, meta }: IProductTypeSelectProps & { intl: IntlShape }) => {
    const showError = meta.touched && meta.error;

    return (
      <FormNativeSelectField
        labelProps={{
          children: intl.formatMessage({
            id: 'AdminProducts.productTypeSelect.label',
          }),
        }}
        selectProps={{
          ...input,
          defaultOption: {
            title: intl.formatMessage({
              id: 'AdminProducts.productTypeSelect.defaultOption.title',
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

const getProductTypesSelectRenderer = (
  categories: AdminProductTypesStateContextValue['adminProductTypesState']['productTypes'],
) => (fieldRenderProps: FieldRenderProps<string>) => (
  <ProductTypeSelect categories={categories} {...fieldRenderProps} />
);

const ImagesInput: React.SFC<FieldRenderProps<Array<File | undefined>>> = injectIntl<
  'intl',
  FieldRenderProps<Array<File | undefined>> & {
    intl: IntlShape;
  }
>(
  React.memo(
    ({ input, meta, intl }) => {
      const showError = meta.touched && meta.error;

      const { onChange } = input;
      const value = typeof input.value.map !== 'function' ? [] : input.value;

      return (
        <Field>
          <Label>{intl.formatMessage({ id: 'AdminProducts.images' })}</Label>
          {value.map((file, i) => (
            <div
              css={css`
                position: relative;
              `}
              key={typeof file === 'string' ? file : (file as File).lastModified.toString()}
            >
              <FileInput
                value={file}
                onChange={newFile => {
                  const newFiles = [...value];
                  newFiles[i] = newFile;
                  onChange(newFiles);
                }}
                accept="image/*"
                placeholder={intl.formatMessage({
                  id: 'common.chooseImage',
                })}
              />
              <Button
                css={css`
                  position: absolute;
                  bottom: 0;
                  right: 0;
                `}
                color="is-danger"
                onClick={e => {
                  e.preventDefault();
                  const newFiles = value.filter((_, j) => j !== i);
                  onChange(newFiles);
                }}
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </Button>
            </div>
          ))}
          <FileInput
            value={undefined}
            onChange={newFile => {
              onChange([...value, newFile]);
            }}
            accept="image/*"
            placeholder={intl.formatMessage({
              id: 'common.chooseImage',
            })}
          />
          <HelpText type="is-danger">{showError ? intl.formatMessage({ id: meta.error }) : undefined}</HelpText>
        </Field>
      );
    },
    (prevProps, nextProps) => arePropsEqual(prevProps, nextProps, ['input']),
  ),
);

const renderImagesInput = (props: FieldRenderProps<Array<File | undefined>>) => <ImagesInput {...props} />;

export interface IFieldsProps {
  productTypes: AdminProductTypesStateContextValue['adminProductTypesState']['productTypes'];
  featureValues: AdminFeatureValuesStateContextValue['adminFeatureValuesState']['featureValues'];
}

export const Fields: React.SFC<IFieldsProps> = React.memo(
  ({ productTypes, featureValues }) => {
    const {
      values: { product_type_id: productTypeID },
    } = useFormState();

    const productType = productTypes.find(({ id }) => parseInt(productTypeID, 10) === id);

    return (
      <React.Fragment>
        <FinalFormField key="price" name="price" render={renderPriceField} />
        <FinalFormField key="discount" name="discount" render={renderDiscountField} />
        <FinalFormField key="quantity" name="quantity" render={renderQuantityField} />
        <FinalFormField key="upc" name="upc" render={renderUPCField} />
        <FinalFormField key="sku" name="sku" render={renderSKUField} />
        <FinalFormField
          key="product_type_id"
          name="product_type_id"
          render={getProductTypesSelectRenderer(productTypes)}
        />
        <FinalFormField
          key="feature_values"
          name="feature_values"
          render={getFeatureValuesSelectRenderer(
            featureValues.filter(({ feature_type: { id: featureTypeID } }) =>
              productType ? productType.feature_types.indexOf(featureTypeID) !== -1 : false,
            ),
          )}
        />
        <FinalFormField key="images" name="images" render={renderImagesInput} />
      </React.Fragment>
    );
  },
  (prevProps, nextProps) =>
    arePropsEqual(prevProps, nextProps, [
      { key: 'productTypes', compare: lengthCompare },
      { key: 'featureValues', compare: lengthCompare },
    ]),
);

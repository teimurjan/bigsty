import * as React from 'react';

import { useIntl } from 'react-intl';

import { FieldRenderProps } from 'react-final-form';

import { FormNativeSelectField } from 'src/components/common/FormNativeSelectField/FormNativeSelectField';

import { IProductTypeListRawIntlMinifiedResponseItem } from 'src/api/ProductTypeAPI';

interface IProps {
  productTypes: IProductTypeListRawIntlMinifiedResponseItem[];
}

export const ProductTypeSelectView = ({ productTypes, input, meta }: IProps & FieldRenderProps<string>) => {
  const intl = useIntl();
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
        options: productTypes.map(({ id, name }) => ({
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
};

import * as React from 'react';

import { History } from 'history';
import * as yup from 'yup';

import * as schemaValidator from 'src/components/SchemaValidator';

import { IProductService } from 'src/services/ProductService';

import { IContextValue as AdminFeatureValuesStateContextValue } from 'src/state/AdminFeatureValuesState';
import { IContextValue as AdminProductsStateContextValue } from 'src/state/AdminProductsState';
import { IContextValue as AdminProductTypesStateContextValue } from 'src/state/AdminProductTypesState';

import { IProductTypeListRawIntlResponseItem } from 'src/api/ProductTypeAPI';
import { useDebounce } from 'src/hooks/useDebounce';

export interface IProps
  extends AdminFeatureValuesStateContextValue,
    AdminProductsStateContextValue,
    AdminProductTypesStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  service: IProductService;
  history: History;
}

export interface IViewProps {
  isOpen: boolean;
  create: (values: {
    quantity: string;
    discount: string;
    price: string;
    feature_values: string[];
    product_type_id: string;
    images: Array<string | File>;
  }) => void;
  isLoading: boolean;
  isCreating: boolean;
  error?: string;
  preloadingError?: string;
  close: () => void;
  validate?: (values: object) => object | Promise<object>;
  featureValues: AdminFeatureValuesStateContextValue['adminFeatureValuesState']['featureValues'];
  productTypes: IProductTypeListRawIntlResponseItem[];
}

export const AdminProductsCreatePresenter: React.FC<IProps> = ({
  history,
  adminFeatureValuesState: { getFeatureValues, featureValues, isListLoading: featureValuesLoading },
  adminProductTypesState: { getProductTypes, productTypes, isListLoading: productTypesLoading },
  adminProductsState: { getProducts },
  service,
  View,
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isCreating, setCreating] = React.useState(false);
  const [preloadingError, setPreloadingError] = React.useState<string | undefined>(undefined);

  const isLoadingDebounced = useDebounce(featureValuesLoading || productTypesLoading, 500);

  const validator = new schemaValidator.SchemaValidator(
    yup.object().shape({
      quantity: yup.number().required('common.errors.field.empty'),
      discount: yup.number().required('common.errors.field.empty'),
      price: yup.number().required('common.errors.field.empty'),
      upc: yup.string().nullable(true),
      sku: yup.string().nullable(true),
      product_type_id: yup.number().required('common.errors.field.empty'),
      feature_values: yup
        .array()
        .of(yup.number())
        .test('allFeatureValuesChosen', 'AdminProducts.errors.noFeatureValues', function(value) {
          if (!this.parent.product_type_id) {
            return true;
          }

          const chosenProductType = productTypes.find(({ id }) => this.parent.product_type_id === id);
          return chosenProductType ? chosenProductType.feature_types.length === (value || []).length : false;
        }),
      images: yup.array().of(yup.mixed()),
    }),
  );

  React.useEffect(() => {
    (async () => {
      try {
        await Promise.all([getProductTypes(), getFeatureValues()]);
      } catch (e) {
        setPreloadingError('errors.common');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = React.useCallback(() => history.push('/admin/products'), [history]);

  const create: IViewProps['create'] = React.useCallback(
    async values => {
      setCreating(true);

      const formattedValues = {
        ...values,
        product_type_id: parseInt(values.product_type_id, 10),
        quantity: parseInt(values.quantity, 10),
        discount: parseInt(values.discount, 10),
        price: parseInt(values.price, 10),
        feature_values: values.feature_values.map(id => parseInt(id, 10)),
      };

      try {
        await service.create(formattedValues);
        getProducts();
        setCreating(false);
        close();
      } catch (e) {
        setError('errors.common');
        setCreating(false);
      }
    },
    [close, getProducts, service],
  );

  return (
    <View
      productTypes={productTypes}
      featureValues={featureValues}
      isOpen={true}
      create={create}
      error={error}
      isLoading={isLoadingDebounced}
      isCreating={isCreating}
      close={close}
      validate={(validator || { validate: undefined }).validate}
      preloadingError={preloadingError}
    />
  );
};

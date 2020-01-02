import * as React from 'react';

import { History } from 'history';
import * as yup from 'yup';

import * as schemaValidator from 'src/components/SchemaValidator';

import { IProductTypeService } from 'src/services/ProductTypeService';

import { IContextValue as AdminCategoriesStateContextValue } from 'src/state/AdminCategoriesState';
import { IContextValue as AdminFeatureTypesStateContextValue } from 'src/state/AdminFeatureTypesState';
import { IContextValue as AdminProductTypesStateContextValue } from 'src/state/AdminProductTypesState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

import { useTimeoutExpired } from 'src/hooks/useTimeoutExpired';
import { useLazy } from 'src/hooks/useLazy';

import { getFieldName, parseFieldName } from '../../IntlField';

export interface IProps
  extends AdminCategoriesStateContextValue,
    AdminFeatureTypesStateContextValue,
    AdminProductTypesStateContextValue,
    IntlStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  service: IProductTypeService;
  history: History;
}

export interface IViewProps {
  isOpen: boolean;
  create: (values: {
    names: { [key: string]: string };
    descriptions: { [key: string]: string };
    short_descriptions: { [key: string]: string };
    feature_types: string[];
    category_id?: string;
    image: string;
  }) => any;
  isLoading: boolean;
  isCreating: boolean;
  error?: string;
  preloadingError?: string;
  close: () => any;
  availableLocales: IntlStateContextValue['intlState']['availableLocales'];
  validate?: (values: object) => object | Promise<object>;
  categories: AdminCategoriesStateContextValue['adminCategoriesState']['categories'];
  featureTypes: AdminFeatureTypesStateContextValue['adminFeatureTypesState']['featureTypes'];
}

export const PRODUCT_TYPE_NAME_FIELD_KEY = 'name';
export const PRODUCT_TYPE_DESCRIPTION_FIELD_KEY = 'description';
export const PRODUCT_TYPE_SHORT_DESCRIPTION_FIELD_KEY = 'short_description';

export const AdminProductTypesCreatePresenter: React.FC<IProps> = ({
  intlState,
  history,
  adminCategoriesState: { getCategories, categories, isListLoading: categoriesLoading },
  adminFeatureTypesState: { getFeatureTypes, featureTypes, isListLoading: featureTypesLoading },
  adminProductTypesState: { getProductTypes },
  service,
  View,
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isCreating, setCreating] = React.useState(false);
  const [preloadingError, setPreloadingError] = React.useState<string | undefined>(undefined);

  const isTimeoutExpired = useTimeoutExpired(1000);

  const makeValidator = React.useCallback(
    () =>
      new schemaValidator.SchemaValidator(
        yup.object().shape(
          intlState.availableLocales.reduce(
            (acc, locale) => ({
              ...acc,
              [getFieldName(PRODUCT_TYPE_NAME_FIELD_KEY, locale)]: yup.string().required('common.errors.field.empty'),
              [getFieldName(PRODUCT_TYPE_SHORT_DESCRIPTION_FIELD_KEY, locale)]: yup
                .string()
                .required('common.errors.field.empty'),
              [getFieldName(PRODUCT_TYPE_DESCRIPTION_FIELD_KEY, locale)]: yup
                .string()
                .required('common.errors.field.empty'),
            }),
            {
              category_id: yup.number().required('common.errors.field.empty'),
              feature_types: yup
                .array()
                .of(yup.number())
                .required('AdminProductTypes.errors.noFeatureTypes')
                .min(1, 'AdminProductTypes.errors.noFeatureTypes'),
              image: yup.mixed().required('common.errors.field.empty'),
            },
          ),
        ),
      ),
    [intlState],
  );

  const validator = useLazy({
    make: makeValidator,
    trigger: intlState.availableLocales.length,
  });

  React.useEffect(() => {
    (async () => {
      try {
        await Promise.all([getCategories(), getFeatureTypes()]);
      } catch (e) {
        setPreloadingError('errors.common');
      }
    })();
  }, [getCategories, getFeatureTypes]);

  const close = React.useCallback(() => history.push('/admin/productTypes'), [history]);

  const create: IViewProps['create'] = React.useCallback(
    async values => {
      setCreating(true);

      const formattedValues = Object.keys(values).reduce(
        (acc, fieldName) => {
          const { key, id } = parseFieldName(fieldName);
          if (
            [
              PRODUCT_TYPE_NAME_FIELD_KEY,
              PRODUCT_TYPE_DESCRIPTION_FIELD_KEY,
              PRODUCT_TYPE_SHORT_DESCRIPTION_FIELD_KEY,
            ].indexOf(key) !== -1
          ) {
            const pluralKeys = `${key}s`;
            return { ...acc, [pluralKeys]: { ...acc[pluralKeys], [id]: values[fieldName] } };
          }

          return acc;
        },
        {
          names: {},
          descriptions: {},
          short_descriptions: {},
          category_id: parseInt(values.category_id as string, 10),
          feature_types: values.feature_types.map(id => parseInt(id, 10)),
          image: values.image,
        },
      );

      try {
        await service.create(formattedValues);
        getProductTypes();
        setCreating(false);
        close();
      } catch (e) {
        setError('errors.common');
        setCreating(false);
      }
    },
    [getProductTypes, close, service],
  );

  return (
    <View
      categories={categories}
      featureTypes={featureTypes}
      isOpen={true}
      create={create}
      error={error}
      isLoading={isTimeoutExpired && categoriesLoading && featureTypesLoading}
      isCreating={isCreating}
      close={close}
      availableLocales={intlState.availableLocales}
      validate={(validator || { validate: undefined }).validate}
      preloadingError={preloadingError}
    />
  );
};

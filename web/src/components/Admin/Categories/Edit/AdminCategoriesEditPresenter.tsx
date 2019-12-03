import * as React from 'react';

import { RouteComponentProps } from 'react-router';
import * as yup from 'yup';

import * as schemaValidator from 'src/components/SchemaValidator';

import { IContextValue as AdminCategoriesStateContextValue } from 'src/state/AdminCategoriesState';
import { IContextValue as AdminFeatureTypesStateContextValue } from 'src/state/AdminFeatureTypesState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

import { ICategoryListRawIntlResponseItem } from 'src/api/CategoryAPI';

import { ICategoryService } from 'src/services/CategoryService';

import { getNumberParam } from 'src/utils/url';

import { useTimeoutExpired } from 'src/hooks/useTimeoutExpired';
import { getFieldName, parseFieldName } from '../../IntlField';
import { useLazy } from 'src/hooks/useLazy';

export interface IProps
  extends RouteComponentProps<any>,
    AdminCategoriesStateContextValue,
    AdminFeatureTypesStateContextValue,
    IntlStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  service: ICategoryService;
}

export interface IViewProps {
  isOpen: boolean;
  edit: (values: { names: { [key: string]: string }; feature_types: string[]; parent_category_id?: string }) => any;
  error?: string;
  close: () => any;
  availableLocales: IntlStateContextValue['intlState']['availableLocales'];
  validate?: (values: object) => object | Promise<object>;
  featureTypes: AdminFeatureTypesStateContextValue['adminFeatureTypesState']['featureTypes'];
  categories: AdminCategoriesStateContextValue['adminCategoriesState']['categories'];
  isLoading: boolean;
  isUpdating: boolean;
  preloadingError?: string;
  initialValues: object;
}

export const CATEGORY_NAME_FIELD_KEY = 'name';

export const AdminCategoriesEditPresenter: React.FC<IProps> = ({
  intlState,
  history,
  adminFeatureTypesState: { getFeatureTypes, featureTypes },
  adminCategoriesState: { getCategories, categories, setCategory: setCategoryToState },
  intlState: { availableLocales },
  service,
  View,
  match,
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [category, setCategory] = React.useState<ICategoryListRawIntlResponseItem | undefined>(undefined);
  const [isUpdating, setUpdating] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [preloadingError, setPreloadingError] = React.useState<string | undefined>(undefined);

  const isTimeoutExpired = useTimeoutExpired(1000);

  const makeValidator = React.useCallback(
    () =>
      new schemaValidator.SchemaValidator(
        yup.object().shape(
          intlState.availableLocales.reduce(
            (acc, locale) => ({
              ...acc,
              [getFieldName(CATEGORY_NAME_FIELD_KEY, locale)]: yup.string().required('common.errors.field.empty'),
            }),
            {
              feature_types: yup
                .array()
                .of(yup.number())
                .required('AdminCategories.errors.noFeatureTypes')
                .min(1, 'AdminCategories.errors.noFeatureTypes'),
              parent_category_id: yup.number().nullable(true),
            },
          ),
        ),
      ),
    [intlState],
  );

  const validator = useLazy({
    make: makeValidator,
    trigger: availableLocales.length,
  });

  const id = React.useMemo(() => getNumberParam(match, 'id'), [match]);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await Promise.all([getFeatureTypes(), getCategories()]);

        const category = id ? await service.getOneRawIntl(id) : undefined;
        if (category) {
          setCategory(category);
        } else {
          setPreloadingError('AdminCategories.notFound');
        }
      } catch (e) {
        setPreloadingError('errors.common');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = React.useCallback(() => history.push('/admin/categories'), [history]);

  const edit: IViewProps['edit'] = React.useCallback(
    async values => {
      setUpdating(true);

      const formattedValues = Object.keys(values).reduce(
        (acc, fieldName) => {
          const { key, id } = parseFieldName(fieldName);
          if (key === CATEGORY_NAME_FIELD_KEY) {
            return { ...acc, names: { ...acc.names, [id]: values[fieldName] } };
          }

          return acc;
        },
        {
          feature_types: values.feature_types.map(idStr => parseInt(idStr, 10)),
          names: {},
          parent_category_id: values.parent_category_id ? parseInt(values.parent_category_id, 10) : undefined,
        },
      );

      try {
        const category = await service.edit(id as number, formattedValues);
        setCategoryToState(category);
        setUpdating(false);
        close();
      } catch (e) {
        setError('errors.common');
        setUpdating(false);
      }
    },
    [close, id, service, setCategoryToState],
  );

  const initialValues = React.useMemo(() => {
    if (category) {
      return {
        ...availableLocales.reduce(
          (acc, locale) => ({
            ...acc,
            [getFieldName(CATEGORY_NAME_FIELD_KEY, locale)]: category.name[locale.id],
          }),
          {},
        ),
        feature_types: category.feature_types,
        parent_category_id: category.parent_category_id,
      };
    }

    return {};
  }, [availableLocales, category]);

  return (
    <View
      categories={categories.filter(category => category.id !== id)}
      isOpen={true}
      edit={edit}
      error={error}
      isUpdating={isUpdating}
      isLoading={isTimeoutExpired && isLoading}
      close={close}
      availableLocales={availableLocales}
      validate={(validator || { validate: undefined }).validate}
      featureTypes={featureTypes}
      initialValues={initialValues}
      preloadingError={preloadingError}
    />
  );
};

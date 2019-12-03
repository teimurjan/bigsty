import * as React from 'react';

import { RouteComponentProps } from 'react-router';
import * as yup from 'yup';

import { IFeatureTypeService } from 'src/services/FeatureTypeService';

import * as schemaValidator from 'src/components/SchemaValidator';
import { IContextValue as AdminFeatureTypesStateContextValue } from 'src/state/AdminFeatureTypesState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

import { IFeatureTypeListRawIntlResponseItem } from 'src/api/FeatureTypeAPI';
import { useTimeoutExpired } from 'src/hooks/useTimeoutExpired';
import { getNumberParam } from 'src/utils/url';
import { getFieldName, parseFieldName } from '../../IntlField';
import { useLazy } from 'src/hooks/useLazy';

export interface IProps
  extends RouteComponentProps<{ id: string }>,
    AdminFeatureTypesStateContextValue,
    IntlStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  service: IFeatureTypeService;
}

export interface IViewProps {
  isOpen: boolean;
  edit: (values: { names: { [key: string]: string } }) => any;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | undefined;
  close: () => any;
  availableLocales: IntlStateContextValue['intlState']['availableLocales'];
  validate?: (values: object) => object | Promise<object>;
  initialValues: object;
  preloadingError?: string;
}

export const FEATURE_TYPE_NAME_FIELD_KEY = 'name';

export const AdminFeatureTypesEditPresenter: React.FC<IProps> = ({
  intlState: { availableLocales },
  View,
  history,
  service,
  adminFeatureTypesState: { setFeatureType: setFeatureTypeToState },
  match,
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [preloadingError, setPreloadingError] = React.useState<string | undefined>(undefined);
  const [featureType, setFeatureType] = React.useState<IFeatureTypeListRawIntlResponseItem | undefined>(undefined);
  const [isUpdating, setUpdating] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);

  const isTimeoutExpired = useTimeoutExpired(1000);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const id = getNumberParam(match, 'id');
        const featureType = id ? await service.getOneRawIntl(id) : undefined;
        if (featureType) {
          setFeatureType(featureType);
        } else {
          setPreloadingError('AdminFeatureTypes.notFound');
        }
      } catch (e) {
        setPreloadingError('errors.common');
      } finally {
        setLoading(false);
      }
    })();
  }, [match, service]);

  const makeValidator = React.useCallback(
    () =>
      new schemaValidator.SchemaValidator(
        yup.object().shape(
          availableLocales.reduce(
            (acc, locale) => ({
              ...acc,
              [getFieldName(FEATURE_TYPE_NAME_FIELD_KEY, locale)]: yup.string().required('common.errors.field.empty'),
            }),
            {},
          ),
        ),
      ),
    [availableLocales],
  );

  const validator = useLazy({
    make: makeValidator,
    trigger: availableLocales.length,
  });

  const close = React.useCallback(() => history.push('/admin/featureTypes'), [history]);
  const edit: IViewProps['edit'] = async values => {
    const formattedValues = Object.keys(values).reduce(
      (acc, fieldName) => {
        const { key, id } = parseFieldName(fieldName);
        if (key === FEATURE_TYPE_NAME_FIELD_KEY) {
          return { ...acc, names: { ...acc.names, [id]: values[fieldName] } };
        }

        return acc;
      },
      {
        names: {},
      },
    );

    try {
      const id = getNumberParam(match, 'id');
      const featureType = await service.edit(id as number, formattedValues);
      setFeatureTypeToState(featureType);
      setUpdating(false);
      close();
    } catch (e) {
      setError('errors.common');
      setUpdating(false);
    }
  };

  const initialValues = React.useMemo(() => {
    return availableLocales.reduce(
      (acc, locale) => ({
        ...acc,
        [getFieldName(FEATURE_TYPE_NAME_FIELD_KEY, locale)]: (featureType || { name: '' }).name[locale.id],
      }),
      {},
    );
  }, [availableLocales, featureType]);

  return (
    <View
      isOpen={true}
      edit={edit}
      error={error}
      preloadingError={preloadingError}
      isUpdating={isUpdating}
      isLoading={isLoading && isTimeoutExpired}
      initialValues={initialValues}
      close={close}
      availableLocales={availableLocales}
      validate={(validator || { validate: undefined }).validate}
    />
  );
};

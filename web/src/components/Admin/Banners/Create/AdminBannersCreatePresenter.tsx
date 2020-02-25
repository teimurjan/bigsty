import * as React from 'react';

import { History } from 'history';
import * as yup from 'yup';

import * as schemaValidator from 'src/components/SchemaValidator';

import { IBannerService } from 'src/services/BannerService';

import { IContextValue as AdminBannersStateContextValue } from 'src/state/AdminBannersState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

import { useTimeoutExpired } from 'src/hooks/useTimeoutExpired';
import { useLazy } from 'src/hooks/useLazy';

import { IBannerCreatePayload } from 'src/api/BannerAPI';

import { getFieldName, parseFieldName } from '../../IntlField';

export interface IProps extends AdminBannersStateContextValue, IntlStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  service: IBannerService;
  history: History;
}

export interface IViewProps {
  isOpen: boolean;
  create: (values: IBannerCreatePayload) => void;
  isLoading: boolean;
  isCreating: boolean;
  error?: string;
  close: () => void;
  availableLocales: IntlStateContextValue['intlState']['availableLocales'];
  validate?: (values: object) => object | Promise<object>;
}

export const BANNER_TEXT_FIELD_KEY = 'text';

export const AdminBannersCreatePresenter: React.FC<IProps> = ({
  intlState,
  history,
  adminBannersState: { addBanner, isListLoading: bannersLoading },
  service,
  View,
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isCreating, setCreating] = React.useState(false);

  const isTimeoutExpired = useTimeoutExpired(1000);

  const makeValidator = React.useCallback(
    () =>
      new schemaValidator.SchemaValidator(
        yup.object().shape(
          intlState.availableLocales.reduce(
            (acc, locale) => ({
              ...acc,
              [getFieldName(BANNER_TEXT_FIELD_KEY, locale)]: yup.string().required('common.errors.field.empty'),
            }),
            {
              link: yup.string(),
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

  const close = React.useCallback(() => history.push('/admin/banners'), [history]);

  const create: IViewProps['create'] = React.useCallback(
    async values => {
      setCreating(true);

      const formattedValues = Object.keys(values).reduce(
        (acc, fieldName) => {
          const { key, id } = parseFieldName(fieldName);
          if (key === BANNER_TEXT_FIELD_KEY) {
            return { ...acc, texts: { ...acc.texts, [id]: values[fieldName] } };
          }

          return acc;
        },
        {
          texts: {},
          link: values.link,
          image: values.image,
        },
      );

      try {
        const category = await service.create(formattedValues);
        addBanner(category);
        setCreating(false);
        close();
      } catch (e) {
        setError('errors.common');
        setCreating(false);
      }
    },
    [addBanner, close, service],
  );

  return (
    <View
      isOpen={true}
      create={create}
      error={error}
      isLoading={isTimeoutExpired && bannersLoading}
      isCreating={isCreating}
      close={close}
      availableLocales={intlState.availableLocales}
      validate={(validator || { validate: undefined }).validate}
    />
  );
};

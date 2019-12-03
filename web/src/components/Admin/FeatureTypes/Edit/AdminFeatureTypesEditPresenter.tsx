import * as React from 'react';

import { RouteComponentProps } from 'react-router';
import * as yup from 'yup';

import { IFeatureTypeService } from 'src/services/FeatureTypeService';

import * as schemaValidator from 'src/components/SchemaValidator';
import { IContextValue as AdminFeatureTypesStateContextValue } from 'src/state/AdminFeatureTypesState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

import { IFeatureTypeListRawIntlResponseItem } from 'src/api/FeatureTypeAPI';
import { IInjectedProp as TimeoutExpiredInjectedProp, withTimeoutExpired } from 'src/hooks/useTimeoutExpired';
import { getNumberParam } from 'src/utils/url';
import { getFieldName, parseFieldName } from '../../IntlField';

interface IState {
  isUpdating: boolean;
  isLoading: boolean;
  error?: string;
  preloadingError?: string;
  validator?: schemaValidator.ISchemaValidator;
  featureType?: IFeatureTypeListRawIntlResponseItem;
}

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

export const AdminFeatureTypesEditPresenter = withTimeoutExpired(
  class extends React.Component<IProps & TimeoutExpiredInjectedProp, IState> {
    public state = {
      error: undefined,
      featureType: undefined,
      isLoading: false,
      isUpdating: false,
      preloadingError: undefined,
      validator: undefined,
    };

    public async componentDidMount() {
      const { intlState, service, match } = this.props;

      if (intlState.availableLocales.length > 0) {
        this.initValidator();
      }

      try {
        this.setState({ isLoading: true });
        const id = getNumberParam(match, 'id');
        const featureType = await service.getOneRawIntl(id!);
        if (featureType) {
          this.setState({ featureType });
        } else {
          this.setState({ preloadingError: 'AdminFeatureTypes.notFound' });
        }
      } catch (e) {
        this.setState({ preloadingError: 'errors.common' });
      } finally {
        this.setState({ isLoading: false });
      }
    }

    public componentDidUpdate(prevProps: IProps) {
      const { intlState: newIntlState } = this.props;
      const { intlState: oldIntlState } = prevProps;

      if (newIntlState.availableLocales.length > 0 && oldIntlState.availableLocales.length === 0) {
        this.initValidator();
      }
    }

    public render() {
      const { isUpdating, error, validator, isLoading, preloadingError } = this.state;
      const {
        View,
        intlState: { availableLocales },
        isTimeoutExpired,
      } = this.props;

      return (
        <View
          isOpen={true}
          edit={this.edit}
          error={error}
          isUpdating={isUpdating}
          isLoading={isTimeoutExpired && isLoading}
          close={this.close}
          availableLocales={availableLocales}
          validate={(validator || { validate: undefined }).validate}
          initialValues={this.getInitialValues()}
          preloadingError={preloadingError}
        />
      );
    }

    private initValidator = () => {
      const { validator } = this.state;
      const { intlState } = this.props;

      if (typeof validator === 'undefined') {
        this.setState({
          validator: new schemaValidator.SchemaValidator(
            yup.object().shape(
              intlState.availableLocales.reduce(
                (acc, locale) => ({
                  ...acc,
                  [getFieldName(FEATURE_TYPE_NAME_FIELD_KEY, locale)]: yup
                    .string()
                    .required('common.errors.field.empty'),
                }),
                {},
              ),
            ),
          ),
        });
      }
    };

    private close = () => this.props.history.push('/admin/featureTypes');

    private edit: IViewProps['edit'] = async values => {
      const {
        service,
        adminFeatureTypesState: { setFeatureType },
        match,
      } = this.props;

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
        const featureType = await service.edit(id!, formattedValues);
        setFeatureType(featureType);
        this.close();
      } catch (e) {
        this.setState({ error: 'errors.common' });
      } finally {
        this.setState({ isUpdating: false });
      }
    };

    private getInitialValues = () => {
      const {
        intlState: { availableLocales },
      } = this.props;
      const { featureType } = this.state;

      return availableLocales.reduce(
        (acc, locale) => ({
          ...acc,
          [getFieldName(FEATURE_TYPE_NAME_FIELD_KEY, locale)]: (featureType || { name: '' }).name[locale.id],
        }),
        {},
      );
    };
  },
  1000,
);

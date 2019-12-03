import * as React from 'react';

import { RouteComponentProps } from 'react-router';
import * as yup from 'yup';

import { IFeatureValueService } from 'src/services/FeatureValueService';

import * as schemaValidator from 'src/components/SchemaValidator';

import { IContextValue as AdminFeatureTypesStateContextValue } from 'src/state/AdminFeatureTypesState';
import { IContextValue as AdminFeatureValuesStateContextValue } from 'src/state/AdminFeatureValuesState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

import { IInjectedProp as TimeoutExpiredInjectedProp, withTimeoutExpired } from 'src/hooks/useTimeoutExpired';

import { getFieldName, parseFieldName } from '../../IntlField';

interface IState {
  isCreating: boolean;
  error: string | undefined;
  validator?: schemaValidator.ISchemaValidator;
}

export interface IProps
  extends RouteComponentProps<any>,
    AdminFeatureValuesStateContextValue,
    AdminFeatureTypesStateContextValue,
    IntlStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  service: IFeatureValueService;
}

export interface IViewProps {
  isOpen: boolean;
  create: (values: { names: { [key: string]: string }; feature_type_id: string }) => any;
  isCreating: boolean;
  isLoading: boolean;
  error: string | undefined;
  close: () => any;
  availableLocales: IntlStateContextValue['intlState']['availableLocales'];
  featureTypes: AdminFeatureTypesStateContextValue['adminFeatureTypesState']['featureTypes'];
  validate?: (values: object) => object | Promise<object>;
}

export const FEATURE_VALUE_NAME_FIELD_KEY = 'name';

export const AdminFeatureValuesCreatePresenter = withTimeoutExpired(
  class extends React.Component<IProps & TimeoutExpiredInjectedProp, IState> {
    public state = {
      error: undefined,
      isCreating: false,
      validator: undefined,
    };

    public componentDidMount() {
      const { intlState, adminFeatureTypesState } = this.props;

      if (intlState.availableLocales.length > 0) {
        this.initValidator();
      }

      adminFeatureTypesState.getFeatureTypes();
    }

    public componentDidUpdate(prevProps: IProps) {
      const { intlState: newIntlState } = this.props;
      const { intlState: oldIntlState } = prevProps;

      if (newIntlState.availableLocales.length > 0 && oldIntlState.availableLocales.length === 0) {
        this.initValidator();
      }
    }

    public render() {
      const { isCreating, error, validator } = this.state;
      const {
        View,
        intlState: { availableLocales },
        isTimeoutExpired,
        adminFeatureTypesState: { featureTypes, isListLoading: featureTypesLoading },
      } = this.props;

      return (
        <View
          isOpen={true}
          create={this.create}
          error={error}
          isCreating={isCreating}
          isLoading={isTimeoutExpired && featureTypesLoading}
          close={this.close}
          availableLocales={availableLocales}
          featureTypes={featureTypes}
          validate={(validator || { validate: undefined }).validate}
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
                  [getFieldName(FEATURE_VALUE_NAME_FIELD_KEY, locale)]: yup
                    .string()
                    .required('common.errors.field.empty'),
                }),
                {
                  feature_type_id: yup.number().required('common.errors.field.empty'),
                },
              ),
            ),
          ),
        });
      }
    };

    private close = () => this.props.history.push('/admin/featureValues');

    private create: IViewProps['create'] = async values => {
      const {
        service,
        adminFeatureValuesState: { addFeatureValue },
      } = this.props;

      const formattedValues = Object.keys(values).reduce(
        (acc, fieldName) => {
          const { key, id } = parseFieldName(fieldName);
          if (key === FEATURE_VALUE_NAME_FIELD_KEY) {
            return { ...acc, names: { ...acc.names, [id]: values[fieldName] } };
          }

          return acc;
        },
        {
          feature_type_id: parseInt(values.feature_type_id, 10),
          names: {},
        },
      );

      try {
        const featureValue = await service.create(formattedValues);
        addFeatureValue(featureValue);
        this.close();
      } catch (e) {
        this.setState({ error: 'errors.common' });
      } finally {
        this.setState({ isCreating: false });
      }
    };
  },
);

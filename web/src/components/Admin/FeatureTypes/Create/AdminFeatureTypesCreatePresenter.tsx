import * as React from 'react';

import { RouteComponentProps } from 'react-router';
import * as yup from 'yup';

import { IFeatureTypeService } from 'src/services/FeatureTypeService';

import * as schemaValidator from 'src/components/SchemaValidator';
import { IContextValue as AdminFeatureTypesStateContextValue } from 'src/state/AdminFeatureTypesState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

import { getFieldName, parseFieldName } from '../../IntlField';

interface IState {
  isCreating: boolean;
  error: string | undefined;
  validator?: schemaValidator.ISchemaValidator;
}

export interface IProps extends RouteComponentProps<any>, AdminFeatureTypesStateContextValue, IntlStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  service: IFeatureTypeService;
}

export interface IViewProps {
  isOpen: boolean;
  create: (values: { names: { [key: string]: string } }) => any;
  isLoading: boolean;
  error: string | undefined;
  close: () => any;
  availableLocales: IntlStateContextValue['intlState']['availableLocales'];
  validate?: (values: object) => object | Promise<object>;
}

export const FEATURE_TYPE_NAME_FIELD_KEY = 'name';

export class AdminFeatureTypesCreatePresenter extends React.Component<IProps, IState> {
  public state = {
    error: undefined,
    isCreating: false,
    validator: undefined,
  };

  public componentDidMount() {
    const { intlState } = this.props;

    if (intlState.availableLocales.length > 0) {
      this.initValidator();
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
    const { isCreating, error, validator } = this.state;
    const {
      View,
      intlState: { availableLocales },
    } = this.props;

    return (
      <View
        isOpen={true}
        create={this.create}
        error={error}
        isLoading={isCreating}
        close={this.close}
        availableLocales={availableLocales}
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
                [getFieldName(FEATURE_TYPE_NAME_FIELD_KEY, locale)]: yup.string().required('common.errors.field.empty'),
              }),
              {},
            ),
          ),
        ),
      });
    }
  };

  private close = () => this.props.history.push('/admin/featureTypes');

  private create: IViewProps['create'] = async values => {
    const {
      service,
      adminFeatureTypesState: { addFeatureType },
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
      const featureType = await service.create(formattedValues);
      addFeatureType(featureType);
      this.close();
    } catch (e) {
      this.setState({ error: 'errors.common' });
    } finally {
      this.setState({ isCreating: false });
    }
  };
}

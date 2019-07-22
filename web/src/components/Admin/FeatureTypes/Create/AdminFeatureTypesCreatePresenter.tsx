import * as React from "react";

import { RouteComponentProps } from "react-router";
import * as yup from "yup";

import * as schemaValidator from "src/components/SchemaValidator";
import { IContextValue as AdminFeatureTypesStateContextValue } from "src/state/AdminFeatureTypesState";
import { IContextValue as IntlStateContextValue } from "src/state/IntlState";

export interface IProps
  extends RouteComponentProps<any>,
    AdminFeatureTypesStateContextValue,
    IntlStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
}

export interface IViewProps {
  isOpen: boolean;
  create: (values: object) => any;
  isLoading: boolean;
  error: string | undefined;
  close: () => any;
  availableLocales: IntlStateContextValue["intlState"]["availableLocales"];
  validate: (values: object) => object | Promise<object>;
  getFieldName: typeof getFieldName;
}

const getFieldName = (
  locale: IntlStateContextValue["intlState"]["availableLocales"][0]
) => `${locale.name}-${locale.id}`;
const getFieldIDFromName = (fieldName: string) => fieldName.split("-").pop()!;

const DEFAULT_SCHEMA_VALIDATOR = {
  validate: () => ({ NOT: "INITIALIZED" })
};

export class AdminFeatureTypesCreatePresenter extends React.Component<IProps> {
  private validator: schemaValidator.ISchemaValidator = DEFAULT_SCHEMA_VALIDATOR;

  public componentWillMount() {
    this.initValidator();
  }

  public componentDidUpdate(prevProps: IProps) {
    const { intlState: newIntlState } = this.props;
    const { intlState: oldIntlState } = prevProps;

    if (
      newIntlState.availableLocales.length > 0 &&
      oldIntlState.availableLocales.length === 0
    ) {
      this.initValidator();
    }
  }

  public render() {
    const {
      View,
      adminFeatureTypesState: { isCreateLoading, createError },
      intlState: { availableLocales }
    } = this.props;

    return (
      <View
        isOpen={true}
        create={this.create}
        error={createError}
        isLoading={isCreateLoading}
        close={this.close}
        availableLocales={availableLocales}
        validate={this.validator.validate}
        getFieldName={getFieldName}
      />
    );
  }

  private initValidator = () => {
    const { intlState } = this.props;
    this.validator = new schemaValidator.SchemaValidator(
      yup.object().shape(
        intlState.availableLocales.reduce(
          (acc, locale) => ({
            ...acc,
            [getFieldName(locale)]: yup
              .string()
              .required("common.errors.field.empty")
          }),
          {}
        )
      )
    );
  };

  private close = () => this.props.history.goBack();

  private create = async (values: object) => {
    const {
      adminFeatureTypesState: { createFeatureType }
    } = this.props;

    const payload = Object.keys(values).reduce(
      (acc, fieldName) => ({
        ...acc,
        [getFieldIDFromName(fieldName)]: values[fieldName]
      }),
      {}
    );

    const isCreated = await createFeatureType({ names: payload });

    if (isCreated) {
      this.close();
    }
  };
}

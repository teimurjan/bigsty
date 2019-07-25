import * as React from "react";

import { RouteComponentProps } from "react-router";
import * as yup from "yup";

import * as schemaValidator from "src/components/SchemaValidator";

import { IContextValue as AdminCategoriesStateContextValue } from "src/state/AdminCategoriesState";
import { IContextValue as AdminFeatureTypesStateContextValue } from "src/state/AdminFeatureTypesState";
import { IContextValue as IntlStateContextValue } from "src/state/IntlState";

import { getFieldName, parseFieldName } from "../../IntlField";

export interface IProps
  extends RouteComponentProps<any>,
    AdminCategoriesStateContextValue,
    AdminFeatureTypesStateContextValue,
    IntlStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
}

export interface IViewProps {
  isOpen: boolean;
  create: (values: {
    names: { [key: string]: string };
    feature_types: string[];
    parent_category_id?: string;
  }) => any;
  isLoading: boolean;
  error: string | undefined;
  close: () => any;
  availableLocales: IntlStateContextValue["intlState"]["availableLocales"];
  validate: (values: object) => object | Promise<object>;
  featureTypes: AdminFeatureTypesStateContextValue["adminFeatureTypesState"]["featureTypes"];
  categories: AdminCategoriesStateContextValue["adminCategoriesState"]["categories"];
}

const DEFAULT_SCHEMA_VALIDATOR = {
  validate: () => ({ NOT: "INITIALIZED" })
};

export const CATEGORY_NAME_FIELD_KEY = "name";

export class AdminCategoriesCreatePresenter extends React.Component<IProps> {
  private validator: schemaValidator.ISchemaValidator = DEFAULT_SCHEMA_VALIDATOR;

  public componentDidMount() {
    this.initValidator();

    const {
      adminFeatureTypesState: { getFeatureTypes }
    } = this.props;
    getFeatureTypes();
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
      adminCategoriesState: { isCreateLoading, createError, categories },
      // TODO: pass feature types loading state to show spinner till they are loaded
      adminFeatureTypesState: { featureTypes },
      intlState: { availableLocales }
    } = this.props;

    return (
      <View
        categories={categories}
        isOpen={true}
        create={this.create}
        error={createError}
        isLoading={isCreateLoading}
        close={this.close}
        availableLocales={availableLocales}
        validate={this.validator.validate}
        featureTypes={featureTypes}
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
            [getFieldName(
              CATEGORY_NAME_FIELD_KEY,
              locale
            )]: yup.string().required("common.errors.field.empty")
          }),
          {
            feature_types: yup
              .array()
              .of(yup.number())
              .required("AdminCategories.errors.noFeatureTypes")
              .min(1, "AdminCategories.errors.noFeatureTypes"),
            parent_category_id: yup.number()
          }
        )
      )
    );
  };

  private close = () => this.props.history.goBack();

  private create: IViewProps["create"] = async values => {
    const {
      adminCategoriesState: { createCategory }
    } = this.props;

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
        parent_category_id: values.parent_category_id
          ? parseInt(values.parent_category_id, 10)
          : undefined
      }
    );

    const isCreated = await createCategory(formattedValues);

    if (isCreated) {
      this.close();
    }
  };
}

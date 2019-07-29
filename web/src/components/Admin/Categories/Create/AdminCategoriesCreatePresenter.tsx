import * as React from "react";

import { RouteComponentProps } from "react-router";
import * as yup from "yup";

import * as schemaValidator from "src/components/SchemaValidator";

import { ICategoryService } from "src/services/CategoryService";
import { IContextValue as AdminCategoriesStateContextValue } from "src/state/AdminCategoriesState";
import { IContextValue as AdminFeatureTypesStateContextValue } from "src/state/AdminFeatureTypesState";
import { IContextValue as IntlStateContextValue } from "src/state/IntlState";

import { getFieldName, parseFieldName } from "../../IntlField";

interface IState {
  isCreating: boolean;
  error: string | undefined;
  validator?: schemaValidator.ISchemaValidator;
}

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
  create: (values: {
    names: { [key: string]: string };
    feature_types: string[];
    parent_category_id?: string;
  }) => any;
  isLoading: boolean;
  error: string | undefined;
  close: () => any;
  availableLocales: IntlStateContextValue["intlState"]["availableLocales"];
  validate?: (values: object) => object | Promise<object>;
  featureTypes: AdminFeatureTypesStateContextValue["adminFeatureTypesState"]["featureTypes"];
  categories: AdminCategoriesStateContextValue["adminCategoriesState"]["categories"];
}

export const CATEGORY_NAME_FIELD_KEY = "name";

export class AdminCategoriesCreatePresenter extends React.Component<
  IProps,
  IState
> {
  public state = {
    error: undefined,
    isCreating: false,
    validator: undefined
  };

  public componentDidMount() {
    const { intlState } = this.props;
    if (intlState.availableLocales.length > 0) {
      this.initValidator();
    }

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
      adminCategoriesState: { categories },
      // TODO: pass feature types loading state to show spinner till they are loaded
      adminFeatureTypesState: { featureTypes },
      intlState: { availableLocales }
    } = this.props;

    const { error, isCreating, validator } = this.state;

    return (
      <View
        categories={categories}
        isOpen={true}
        create={this.create}
        error={error}
        isLoading={isCreating}
        close={this.close}
        availableLocales={availableLocales}
        validate={(validator || { validate: undefined }).validate}
        featureTypes={featureTypes}
      />
    );
  }

  private initValidator = () => {
    const { intlState } = this.props;
    this.setState({
      validator: new schemaValidator.SchemaValidator(
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
      )
    });
  };

  private close = () => this.props.history.goBack();

  private create: IViewProps["create"] = async values => {
    const { service, adminCategoriesState } = this.props;

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

    try {
      const category = await service.create(formattedValues);
      adminCategoriesState.addCategory(category);
    } catch (e) {
      this.setState({ error: "errors.common" });
    } finally {
      this.setState({ isCreating: false });
    }
  };
}

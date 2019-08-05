import * as React from "react";

import { RouteComponentProps } from "react-router";
import * as yup from "yup";

import * as schemaValidator from "src/components/SchemaValidator";

import { ICategoryService } from "src/services/CategoryService";
import { IContextValue as AdminCategoriesStateContextValue } from "src/state/AdminCategoriesState";
import { IContextValue as AdminFeatureTypesStateContextValue } from "src/state/AdminFeatureTypesState";
import { IContextValue as IntlStateContextValue } from "src/state/IntlState";

import {
  IInjectedProp as TimeoutExpiredInjectedProp,
  withTimeoutExpired
} from "src/hooks/useTimeoutExpired";
import { getFieldName, parseFieldName } from "../../IntlField";

interface IState {
  isCreating: boolean;
  isLoading: boolean;
  error?: string;
  preloadingError?: string;
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
  isCreating: boolean;
  error?: string;
  preloadingError?: string;
  close: () => any;
  availableLocales: IntlStateContextValue["intlState"]["availableLocales"];
  validate?: (values: object) => object | Promise<object>;
  featureTypes: AdminFeatureTypesStateContextValue["adminFeatureTypesState"]["featureTypes"];
  categories: AdminCategoriesStateContextValue["adminCategoriesState"]["categories"];
}

export const CATEGORY_NAME_FIELD_KEY = "name";

export const AdminCategoriesCreatePresenter = withTimeoutExpired(
  class extends React.Component<IProps & TimeoutExpiredInjectedProp, IState> {
    public state = {
      error: undefined,
      isCreating: false,
      isLoading: false,
      preloadingError: undefined,
      validator: undefined
    };

    public async componentDidMount() {
      const { intlState } = this.props;
      if (intlState.availableLocales.length > 0) {
        this.initValidator();
      }

      const {
        adminFeatureTypesState: { getFeatureTypes },
        adminCategoriesState: { getCategories }
      } = this.props;

      try {
        this.setState({ isLoading: true });
        await getFeatureTypes();
        await getCategories();
      } catch (e) {
        this.setState({ preloadingError: "errors.common" });
      } finally {
        this.setState({ isLoading: false });
      }
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
        adminFeatureTypesState: { featureTypes },
        intlState: { availableLocales },
        isTimeoutExpired
      } = this.props;

      const {
        error,
        isCreating,
        validator,
        isLoading,
        preloadingError
      } = this.state;

      return (
        <View
          categories={categories}
          isOpen={true}
          create={this.create}
          error={error}
          isLoading={isTimeoutExpired && isLoading}
          isCreating={isCreating}
          close={this.close}
          availableLocales={availableLocales}
          validate={(validator || { validate: undefined }).validate}
          featureTypes={featureTypes}
          preloadingError={preloadingError}
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

    private close = () => this.props.history.push("/admin/categories");

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
        this.close();
      } catch (e) {
        this.setState({ error: "errors.common" });
      } finally {
        this.setState({ isCreating: false });
      }
    };
  },
  1000
);

import * as React from "react";

import { RouteComponentProps } from "react-router";
import * as yup from "yup";

import * as schemaValidator from "src/components/SchemaValidator";

import { IContextValue as AdminCategoriesStateContextValue } from "src/state/AdminCategoriesState";
import { IContextValue as AdminFeatureTypesStateContextValue } from "src/state/AdminFeatureTypesState";
import { IContextValue as IntlStateContextValue } from "src/state/IntlState";

import { ICategoryListRawIntlResponseItem } from "src/api/CategoryAPI";

import { ICategoryService } from "src/services/CategoryService";

import { getNumberParam } from "src/utils/url";

import {
  IInjectedProp as TimeoutExpiredInjectedProp,
  withTimeoutExpired
} from "src/hooks/useTimeoutExpired";
import { getFieldName, parseFieldName } from "../../IntlField";

interface IState {
  isUpdating: boolean;
  isLoading: boolean;
  error?: string;
  preloadingError?: string;
  validator?: schemaValidator.ISchemaValidator;
  category?: ICategoryListRawIntlResponseItem;
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
  edit: (values: {
    names: { [key: string]: string };
    feature_types: string[];
    parent_category_id?: string;
  }) => any;
  error?: string;
  close: () => any;
  availableLocales: IntlStateContextValue["intlState"]["availableLocales"];
  validate?: (values: object) => object | Promise<object>;
  featureTypes: AdminFeatureTypesStateContextValue["adminFeatureTypesState"]["featureTypes"];
  categories: AdminCategoriesStateContextValue["adminCategoriesState"]["categories"];
  isLoading: boolean;
  isUpdating: boolean;
  preloadingError?: string;
  initialValues: object;
}

export const CATEGORY_NAME_FIELD_KEY = "name";

export const AdminCategoriesEditPresenter = withTimeoutExpired(
  class extends React.Component<IProps & TimeoutExpiredInjectedProp, IState> {
    public state = {
      category: undefined,
      error: undefined,
      isLoading: false,
      isUpdating: false,
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
        adminCategoriesState: { getCategories },
        service,
        match
      } = this.props;

      try {
        this.setState({ isLoading: true });
        const id = getNumberParam(match, "id");
        await getFeatureTypes();
        await getCategories();
        const category = await service.getOneRawIntl(id!);
        if (category) {
          this.setState({ category });
        } else {
          this.setState({
            preloadingError: "AdminCategories.notFound"
          });
        }
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
        isTimeoutExpired,
        match
      } = this.props;

      const {
        error,
        isUpdating,
        validator,
        isLoading,
        preloadingError
      } = this.state;

      const id = getNumberParam(match, "id");

      return (
        <View
          categories={categories.filter(category => category.id !== id)}
          isOpen={true}
          edit={this.edit}
          error={error}
          isUpdating={isUpdating}
          isLoading={isTimeoutExpired && isLoading}
          close={this.close}
          availableLocales={availableLocales}
          validate={(validator || { validate: undefined }).validate}
          featureTypes={featureTypes}
          initialValues={this.getInitialValues()}
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
                parent_category_id: yup.number().nullable(true)
              }
            )
          )
        )
      });
    };

    private close = () => this.props.history.push("/admin/categories");

    private edit: IViewProps["edit"] = async values => {
      const { service, adminCategoriesState, match } = this.props;

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
        const id = getNumberParam(match, "id");
        const category = await service.edit(id!, formattedValues);
        adminCategoriesState.setCategory(category);
        this.close();
      } catch (e) {
        this.setState({ error: "errors.common" });
      } finally {
        this.setState({ isUpdating: false });
      }
    };

    private getInitialValues = () => {
      const {
        intlState: { availableLocales }
      } = this.props;
      const { category } = this.state;

      if (!category) {
        return {};
      }

      return {
        ...availableLocales.reduce(
          (acc, locale) => ({
            ...acc,
            [getFieldName(
              CATEGORY_NAME_FIELD_KEY,
              locale
            )]: (category! as ICategoryListRawIntlResponseItem).name[locale.id]
          }),
          {}
        ),
        feature_types: (category! as ICategoryListRawIntlResponseItem)
          .feature_types,
        parent_category_id: (category! as ICategoryListRawIntlResponseItem)
          .parent_category_id
      };
    };
  },
  1000
);

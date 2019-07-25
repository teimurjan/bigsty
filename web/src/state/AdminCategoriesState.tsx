import * as React from "react";

import {
  ICategoryCreatePayload,
  ICategoryListRawIntlResponseItem
} from "src/api/CategoryAPI";
import { injectDependencies } from "src/DI/DI";
import { extendIntlTextWithLocaleNames } from "src/helpers/intl";
import { ICategoryService } from "src/services/CategoryService";
import {
  IContextValue as IntlStateContextValue,
  injectIntlState
} from "src/state/IntlState";

export interface IContextValue {
  adminCategoriesState: {
    categories: ICategoryListRawIntlResponseItem[];
    isListLoading: boolean;
    hasListLoaded: boolean;
    createError: undefined | string;
    listError: undefined | string;
    isCreateLoading: boolean;
    isDeleteLoading: boolean;
    isDeleteOpen: boolean;
    deleteError: undefined | string;
    getCategories: () => Promise<void>;
    deleteCategory: () => Promise<void>;
    openDeletion: (id: number) => void;
    closeDeletion: () => void;
    createCategory: (payload: ICategoryCreatePayload) => Promise<boolean>;
  };
}

const Context = React.createContext<IContextValue | null>(null);

interface IProviderProps {
  children?: React.ReactNode;
  service: ICategoryService;
}

interface IProviderState {
  categories: { [key: string]: ICategoryListRawIntlResponseItem };
  categoriesOrder: number[];
  createError: undefined | string;
  deleteError: undefined | string;
  deletingCategoryID: number | null;
  isCreateLoading: boolean;
  isDeleteLoading: boolean;
  isListLoading: boolean;
  listError: undefined | string;
  hasListLoaded: boolean;
}

class Provider extends React.Component<
  IProviderProps & IntlStateContextValue,
  IProviderState
> {
  public state = {
    categories: {},
    categoriesOrder: [],
    createError: undefined,
    deleteError: undefined,
    deletingCategoryID: null,
    hasListLoaded: false,
    isCreateLoading: false,
    isDeleteLoading: false,
    isListLoading: false,
    listError: undefined
  };

  public render() {
    const {
      categories,
      categoriesOrder,
      createError,
      deleteError,
      deletingCategoryID,
      isCreateLoading,
      isDeleteLoading,
      isListLoading,
      listError,
      hasListLoaded
    } = this.state;
    const {
      children,
      intlState: { availableLocales }
    } = this.props;
    const {
      getCategories,
      deleteCategory,
      openDeletion,
      closeDeletion,
      createCategory
    } = this;

    return (
      <Context.Provider
        value={{
          adminCategoriesState: {
            categories: categoriesOrder.map(categoryId => {
              const category: ICategoryListRawIntlResponseItem =
                categories[categoryId];

              return {
                ...category,
                name: extendIntlTextWithLocaleNames(
                  category.name,
                  availableLocales
                )
              };
            }),
            closeDeletion,
            createCategory,
            createError,
            deleteCategory,
            deleteError,
            getCategories,
            hasListLoaded,
            isCreateLoading,
            isDeleteLoading,
            isDeleteOpen: !!deletingCategoryID,
            isListLoading,
            listError,
            openDeletion
          }
        }}
      >
        {children}
      </Context.Provider>
    );
  }

  private getCategories = async () => {
    const { service } = this.props;
    this.setState({ isListLoading: true });
    try {
      const { entities, result } = await service.getAllRawIntl();
      this.setState({
        categories: entities.categories,
        categoriesOrder: result,
        hasListLoaded: true,
        isListLoading: false
      });
    } catch (e) {
      this.setState({
        hasListLoaded: true,
        isListLoading: false,
        listError: "errors.common"
      });
    }
  };

  private deleteCategory = async () => {
    const { deletingCategoryID, categories, categoriesOrder } = this.state;
    if (!deletingCategoryID) {
      return;
    }

    const { service } = this.props;
    this.setState({ isDeleteLoading: true });
    try {
      await service.delete(deletingCategoryID!);

      const newCategories = { ...categories };
      delete newCategories[deletingCategoryID!];

      this.setState({
        categories: newCategories,
        categoriesOrder: categoriesOrder.filter(
          id => id !== deletingCategoryID
        ),
        deletingCategoryID: null,
        isDeleteLoading: false
      });
    } catch (e) {
      this.setState({ deleteError: "errors.common", isDeleteLoading: false });
    }
  };

  private openDeletion = (id: number) => {
    this.setState({ deletingCategoryID: id });
  };

  private closeDeletion = () => {
    this.setState({ deletingCategoryID: null });
  };

  // Returns boolean to track if a feature type has been created or not
  private createCategory = async (
    payload: ICategoryCreatePayload
  ): Promise<boolean> => {
    const { categories, categoriesOrder } = this.state;
    const { service } = this.props;
    this.setState({ isCreateLoading: true });
    try {
      const newCategory = await service.create(payload);

      const newCategories = {
        ...categories,
        [newCategory.id]: newCategory
      };

      this.setState({
        categories: newCategories,
        categoriesOrder: [...categoriesOrder, newCategory.id],
        isCreateLoading: false
      });

      return true;
    } catch (e) {
      this.setState({ createError: "errors.common", isCreateLoading: false });

      return false;
    }
  };
}

export const AdminCategoriesStateProvider = injectIntlState(
  injectDependencies(({ dependencies, ...props }) => (
    <Provider {...props} service={dependencies.services.category} />
  ))
);

export const injectAdminCategoriesState = (
  Component: React.ComponentClass<IContextValue> | React.SFC<IContextValue>
): React.SFC<any> => props => (
  <Context.Consumer>
    {(context: IContextValue) => <Component {...{ ...props, ...context }} />}
  </Context.Consumer>
);

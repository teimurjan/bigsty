import * as React from "react";

import { ICategoryListRawIntlResponseItem } from "src/api/CategoryAPI";
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
    listError: undefined | string;
    isDeleteLoading: boolean;
    isDeleteOpen: boolean;
    deleteError: undefined | string;
    getCategories: () => Promise<void>;
    deleteCategory: () => Promise<void>;
    openDeletion: (id: number) => void;
    closeDeletion: () => void;
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
  deleteError: undefined | string;
  deletingCategoryID: number | null;
  isDeleteLoading: boolean;
  isListLoading: boolean;
  listError: undefined | string;
}

class Provider extends React.Component<
  IProviderProps & IntlStateContextValue,
  IProviderState
> {
  public state = {
    categories: {},
    categoriesOrder: [],
    deleteError: undefined,
    deletingCategoryID: null,
    isDeleteLoading: false,
    isListLoading: false,
    listError: undefined
  };

  public render() {
    const {
      categories,
      categoriesOrder,
      deleteError,
      deletingCategoryID,
      isDeleteLoading,
      isListLoading,
      listError
    } = this.state;
    const {
      children,
      intlState: { availableLocales }
    } = this.props;
    const { getCategories, deleteCategory, openDeletion, closeDeletion } = this;

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
            deleteCategory,
            deleteError,
            getCategories,
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
        isListLoading: false
      });
    } catch (e) {
      this.setState({ listError: "errors.common", isListLoading: false });
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

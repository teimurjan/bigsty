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
    hasListLoaded: boolean;
    listError: undefined | string;
    getCategories: () => Promise<void>;
    deleteCategory: (id: number) => void;
    addCategory: (category: ICategoryListRawIntlResponseItem) => void;
    setCategory: (category: ICategoryListRawIntlResponseItem) => void;
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
    hasListLoaded: false,
    isListLoading: false,
    listError: undefined
  };

  public render() {
    const {
      categories,
      categoriesOrder,
      isListLoading,
      listError,
      hasListLoaded
    } = this.state;
    const {
      children,
      intlState: { availableLocales }
    } = this.props;
    const { getCategories, deleteCategory, addCategory, setCategory } = this;

    return (
      <Context.Provider
        value={{
          adminCategoriesState: {
            addCategory,
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
            deleteCategory,
            getCategories,
            hasListLoaded,
            isListLoading,
            listError,
            setCategory
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

  private deleteCategory = (id: number) => {
    const { categories, categoriesOrder } = this.state;

    const newCategories = { ...categories };
    delete newCategories[id];

    this.setState({
      categories: newCategories,
      categoriesOrder: categoriesOrder.filter(idFromOrder => id !== idFromOrder)
    });
  };

  private addCategory = (category: ICategoryListRawIntlResponseItem) => {
    const { categories, categoriesOrder } = this.state;

    const newCategories = {
      ...categories,
      [category.id]: category
    };

    this.setState({
      categories: newCategories,
      categoriesOrder: [...categoriesOrder, category.id]
    });
  };

  private setCategory = (category: ICategoryListRawIntlResponseItem) => {
    const { categories } = this.state;

    const newCategories = {
      ...categories,
      [category.id]: category
    };

    this.setState({ categories: newCategories });
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

import * as React from "react";

import { ICategoryListRawIntlResponseItem } from "src/api/CategoryAPI";
import { ICategoryService } from "src/services/CategoryService";

import { IContextValue as IntlStateContextValue } from "src/state/IntlState";

import { extendIntlTextWithLocaleNames } from "src/helpers/intl";

export interface IProps {
  categoryService: ICategoryService;
  View: React.ComponentClass<IViewProps>;
}

export interface IViewProps {
  categories: ICategoryListRawIntlResponseItem[];
  isLoading: boolean;
  locales: string[];
}

interface IState {
  categories: { [key: string]: ICategoryListRawIntlResponseItem };
  categoriesOrder: number[];
  error: string | undefined;
  isLoading: boolean;
}

export class AdminCategoriesPresenter extends React.Component<
  IProps & IntlStateContextValue,
  IState
> {
  public state = {
    categories: {},
    categoriesOrder: [],
    error: undefined,
    isLoading: false
  };

  public componentDidMount() {
    this.getCategories();
  }

  public render() {
    const { categories, categoriesOrder, isLoading } = this.state;
    const {
      View,
      intlState: { availableLocales }
    } = this.props;
    return (
      <View
        isLoading={isLoading}
        locales={availableLocales.map(({ name }) => name)}
        categories={categoriesOrder.map(categoryId => {
          const category: ICategoryListRawIntlResponseItem =
            categories[categoryId];
          return {
            ...category,
            name: extendIntlTextWithLocaleNames(category.name, availableLocales)
          };
        })}
      />
    );
  }

  private getCategories = async () => {
    const { categoryService } = this.props;
    this.setState({ isLoading: true });
    try {
      const { entities, result } = await categoryService.getAllRawIntl();
      this.setState({
        categories: entities.categories,
        categoriesOrder: result,
        isLoading: false
      });
    } catch (e) {
      this.setState({ error: "errors.common", isLoading: false });
    }
  };
}

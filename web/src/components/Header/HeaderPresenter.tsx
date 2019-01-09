import * as React from "react";
import { ICategoryResponseData } from "src/api/CategoryAPI";
import * as categoryService from "src/services/CategoryService";
import { IContextValue as AppStateContextValue } from "../../state/AppState";

export interface IProps extends AppStateContextValue {
  service: categoryService.ICategoryService;
  View: React.ComponentClass<IViewProps>;
}

export interface IViewProps {
  categories: ICategoryResponseData[];
}

interface IState {
  categories: { [key: string]: ICategoryResponseData };
  categoriesOrder: number[];
  error: string | undefined;
}

export class HeaderPresenter extends React.Component<IProps, IState> {
  public state = {
    categories: {},
    categoriesOrder: [],
    error: undefined
  };

  public componentDidMount() {
    this.getCategories();
  }

  public render() {
    const { categories, categoriesOrder } = this.state;
    const { View } = this.props;
    return (
      <View
        categories={categoriesOrder.map(categoryId => categories[categoryId])}
      />
    );
  }

  private async getCategories() {
    const { service, app } = this.props;
    app.setLoading();
    try {
      const { entities, result } = await service.getAll();
      this.setState({
        categories: entities.categories,
        categoriesOrder: result
      });
    } catch (e) {
      this.setState({ error: "errors.common" });
    }
    app.setIdle();
  }
}

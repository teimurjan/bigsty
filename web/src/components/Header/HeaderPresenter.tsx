import * as React from 'react';

import { ICategoryListResponseItem } from 'src/api/CategoryAPI';
import { ICategoryService } from 'src/services/CategoryService';
import { IContextValue as AppStateContextValue } from 'src/state/AppState';
import { IContextValue as UserStateContextValue, User } from 'src/state/UserState';

export interface IProps extends UserStateContextValue, AppStateContextValue {
  categoryService: ICategoryService;
  View: React.ComponentClass<IViewProps>;
}

export interface IViewProps {
  categories: ICategoryListResponseItem[];
  user: User;
  onLogOutClick: () => void;
}

interface IState {
  categories: { [key: string]: ICategoryListResponseItem };
  categoriesOrder: number[];
  error: string | undefined;
}

export class HeaderPresenter extends React.Component<IProps, IState> {
  public state = {
    categories: {},
    categoriesOrder: [],
    error: undefined,
  };

  public componentDidMount() {
    this.getCategories();
  }

  public render() {
    const { categories, categoriesOrder } = this.state;
    const { View, userState } = this.props;
    return (
      <View
        user={userState.user}
        categories={categoriesOrder.map(categoryId => categories[categoryId])}
        onLogOutClick={this.onLogoutClick}
      />
    );
  }

  private getCategories = async () => {
    const { categoryService, appState } = this.props;
    appState.setLoading();
    try {
      const { entities, result } = await categoryService.getAll();
      this.setState({
        categories: entities.categories,
        categoriesOrder: result,
      });
    } catch (e) {
      this.setState({ error: 'errors.common' });
    }
    appState.setIdle();
  };

  private onLogoutClick = () => {
    const { userState } = this.props;
    userState.clearUser();
  };
}

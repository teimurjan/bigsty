import * as React from 'react';

import { ICategoryListResponseItem } from 'src/api/CategoryAPI';
import { IContextValue as CategoriesStateContextValue } from 'src/state/CategoriesState';

export interface IProps extends CategoriesStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
}

export interface IViewProps {
  categories: ICategoryListResponseItem[];
}

export const NavPresenter = ({ categoriesState, View }: IProps) => {
  return <View categories={categoriesState.categories.filter(category => !category.parent_category_id)} />;
};

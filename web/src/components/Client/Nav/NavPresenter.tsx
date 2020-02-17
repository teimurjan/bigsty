import * as React from 'react';

import { IContextValue as AppStateContextValue } from 'src/state/AppState';
import { ICategoryListResponseItem } from 'src/api/CategoryAPI';
import { ICategoryService } from 'src/services/CategoryService';
import { agregateOrderedMapToArray } from 'src/utils/agregate';

export interface IProps extends AppStateContextValue {
  categoryService: ICategoryService;
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
}

export interface IViewProps {
  categories: ICategoryListResponseItem[];
}

export const NavPresenter = ({ appState, categoryService, View }: IProps) => {
  const [categories, setCategories] = React.useState<{ [key: string]: ICategoryListResponseItem }>({});
  const [categoriesOrder, setCategoriesOrder] = React.useState<number[]>([]);

  React.useEffect(
    () => {
      (async () => {
        appState.setLoading();
        const { entities, result } = await categoryService.getAll();
        setCategories(entities.categories);
        setCategoriesOrder(result);
        appState.setIdle();
      })();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  return (
    <View
      categories={agregateOrderedMapToArray(categories, categoriesOrder).filter(
        category => !category.parent_category_id,
      )}
    />
  );
};

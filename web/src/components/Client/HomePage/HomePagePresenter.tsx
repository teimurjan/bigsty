import * as React from 'react';

import { useTimeoutExpired } from 'src/hooks/useTimeoutExpired';
import { ICategoryService } from 'src/services/CategoryService';
import { ICategoryListResponseItem } from 'src/api/CategoryAPI';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  categoryService: ICategoryService;
}

export interface IViewProps {
  categories: ICategoryListResponseItem[];
  error: string | undefined;
  isLoading: boolean;
}

export const HomePagePresenter = ({ categoryService, View }: IProps) => {
  const isLoadingTimeoutExpired = useTimeoutExpired(1000);
  const [categories, setCategories] = React.useState<{ [id: string]: ICategoryListResponseItem }>({});
  const [categoriesOrder, setCategoriesOrder] = React.useState<number[]>([]);
  const [isLoading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | undefined>(undefined);

  React.useEffect(
    () => {
      (async () => {
        try {
          const { entities, result } = await categoryService.getAll();
          setCategories(entities.categories);
          setCategoriesOrder(result);
        } catch (e) {
          setError('errors.common');
        } finally {
          setLoading(false);
        }
      })();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <View
      isLoading={isLoading && isLoadingTimeoutExpired}
      categories={categoriesOrder.map(id => categories[id])}
      error={error}
    />
  );
};

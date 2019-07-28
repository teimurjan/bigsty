import * as React from "react";

import { RouteComponentProps } from "react-router";

import { ICategoryService } from "src/services/CategoryService";
import { IContextValue as AdminCategoriesContextValue } from "src/state/AdminCategoriesState";

export interface IProps extends RouteComponentProps<any> {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  service: ICategoryService;
}

export interface IViewProps {
  isOpen: boolean;
  remove: () => any;
  isLoading: boolean;
  error: string | undefined;
  close: () => any;
}

export const AdminCategoriesDeletePresenter = ({
  View,
  adminCategoriesState: { deleteCategory, categories, hasListLoaded },
  match,
  history,
  service
}: IProps & AdminCategoriesContextValue) => {
  const close = React.useCallback(() => history.push("/admin/categories"), []);

  const id = parseInt(match.params.id, 10);

  React.useEffect(() => {
    const isCategoryExists =
      hasListLoaded && categories.some(category => category.id === id);

    if (!isCategoryExists) {
      close();
    }
  }, [hasListLoaded, id]);

  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(false);

  const remove = React.useCallback(async () => {
    try {
      setIsLoading(true);
      await service.delete(id);
      deleteCategory(id);
      close();
    } catch (e) {
      setError("errors.common");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  return (
    <View
      isOpen={!!id}
      remove={remove}
      close={close}
      error={error}
      isLoading={isLoading}
    />
  );
};

import * as React from "react";

import { RouteComponentProps } from "react-router";

import { IFeatureTypeService } from "src/services/FeatureTypeService";
import { IContextValue as AdminFeatureTypesContextValue } from "src/state/AdminFeatureTypesState";

export interface IProps extends RouteComponentProps<any> {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  service: IFeatureTypeService;
}

export interface IViewProps {
  isOpen: boolean;
  remove: () => any;
  isLoading: boolean;
  error: string | undefined;
  close: () => any;
}

export const AdminFeatureTypesDeletePresenter = ({
  View,
  adminFeatureTypesState: { deleteFeatureType, featureTypes, hasListLoaded },
  history,
  match,
  service
}: IProps & AdminFeatureTypesContextValue) => {
  const close = React.useCallback(() => history.push('/admin/featureTypes'), []);

  const id = parseInt(match.params.id, 10);

  React.useEffect(() => {
    const isFeatureTypeExists =
      hasListLoaded && featureTypes.some(featureType => featureType.id === id);

    if (!isFeatureTypeExists) {
      close();
    }
  }, [hasListLoaded, id]);

  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(false);

  const remove = React.useCallback(async () => {
    try {
      setIsLoading(true);
      service.delete(id);
      await deleteFeatureType(id);
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

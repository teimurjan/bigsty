import * as React from "react";

import { RouteComponentProps } from "react-router";
import { useTimeoutExpired } from 'src/hooks/useTimeoutExpired';

interface IPreloadDataArgs {
  id: number;
  setError: (error: string | undefined) => void;
  setIsLoading: (isLoading: boolean) => void;
  close: () => void;
}

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  deleteEntity: (id: number) => Promise<any>;
  preloadData: (args: IPreloadDataArgs) => Promise<any>;
  backPath: string;
}

export interface IViewProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => any;
  onConfirm: () => any;
  isLoading?: boolean;
  error: string | undefined;
}

export const DeleteModalPresenter = ({
  View,
  match,
  history,
  preloadData,
  backPath,
  deleteEntity
}: IProps & RouteComponentProps<{ id: string }>) => {
  const close = React.useCallback(() => history.push(backPath), []);

  const id = parseInt(match.params.id, 10);

  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    preloadData({ id, close, setError, setIsLoading });
  }, []);

  const isPreloadingTimeoutExpired = useTimeoutExpired(1000);  

  const remove = React.useCallback(async () => {
    try {
      setIsLoading(true);
      await deleteEntity(id);
      setIsLoading(false);
      close();
    } catch (e) {
      setIsLoading(false);
      setError("errors.common");
    }
  }, [id]);

  return (
    <View
      isOpen={!!id}
      onConfirm={remove}
      onClose={close}
      error={error}
      isLoading={isPreloadingTimeoutExpired && isLoading}
    />
  );
};

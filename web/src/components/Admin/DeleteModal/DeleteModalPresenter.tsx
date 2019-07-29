import * as React from "react";

import { RouteComponentProps } from "react-router";

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  deleteEntity: (id: number) => Promise<any>;
  doesEntityExists: (id: number) => boolean;
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
  doesEntityExists,
  backPath,
  deleteEntity
}: IProps & RouteComponentProps<{ id: string }>) => {
  const close = React.useCallback(() => history.push(backPath), []);

  const id = parseInt(match.params.id, 10);

  React.useEffect(() => {
    if (!doesEntityExists(id)) {
      close();
    }
  }, [doesEntityExists]);

  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(false);

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
      isLoading={isLoading}
    />
  );
};

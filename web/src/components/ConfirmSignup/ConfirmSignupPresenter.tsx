import * as React from 'react';

import { History } from 'history';

import { useQuery } from 'src/hooks/useQuery';

import * as authService from 'src/services/AuthService';

interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  service: authService.IAuthService;
  history: History;
}

export interface IViewProps {
  isLoading: boolean;
  error?: string;
}

export const ConfirmSignupPresenter = ({ View, service, history }: IProps) => {
  const query = useQuery();
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let redirectTimeout: NodeJS.Timeout;

    (async () => {
      try {
        const token = query.get('token');

        if (token) {
          await service.confirmSignup(token);
          redirectTimeout = setTimeout(() => history.push('/login'), 5000);
        } else {
          setError('ConfirmSignup.invalidToken');
        }
      } catch (e) {
        if (e instanceof authService.errors.InvalidSignupToken) {
          setError('ConfirmSignup.invalidToken');
        } else {
          setError('errors.common');
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => clearTimeout(redirectTimeout);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <View isLoading={isLoading} error={error} />;
};

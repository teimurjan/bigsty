import { useRouter } from 'next/router';
import React from 'react';

import { useUserState, User } from 'src/state/UserState';

type Rule = (user: User) => boolean;

export const useProtectedResource = (showRule: Rule, redirectRule: Rule) => {
  const router = useRouter();
  const {
    userState: { user },
  } = useUserState();

  React.useEffect(() => {
    if (redirectRule(user)) {
      router.push('/');
    }
  }, [router, redirectRule, user]);

  return showRule(user);
};

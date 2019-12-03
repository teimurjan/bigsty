import * as React from 'react';

import { injectIntl } from 'react-intl';

import { injectDependencies } from 'src/DI/DI';
import { injectAppState } from 'src/state/AppState';
import { injectUserState } from 'src/state/UserState';

import { HeaderPresenter } from './HeaderPresenter';
import { HeaderView } from './HeaderView';

const ConnectedHeaderPresenter = injectUserState(injectAppState(HeaderPresenter));

export const HeaderContainer = injectDependencies(({ dependencies }) => (
  <ConnectedHeaderPresenter categoryService={dependencies.services.category} View={injectIntl(HeaderView)} />
));

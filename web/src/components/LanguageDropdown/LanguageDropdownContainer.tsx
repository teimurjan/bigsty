import * as React from 'react';

import { injectIntl } from 'react-intl';

import { injectDependencies } from 'src/DI/DI';
import { injectIntlState } from 'src/state/IntlState';

import { LanguageDropdownPresenter } from './LanguageDropdownPresenter';
import { LanguageDropdownView } from './LanguageDropdownView';

const ConnectedLanguageDropdownPresenter = injectIntlState(LanguageDropdownPresenter);

export const LanguageDropdownContainer = injectDependencies(({ dependencies }) => (
  <ConnectedLanguageDropdownPresenter
    View={injectIntl(LanguageDropdownView)}
    intlService={dependencies.services.intl}
  />
));

import * as React from 'react';

import { injectIntl } from 'react-intl';

import { useDependencies } from 'src/DI/DI';
import { useIntlState } from 'src/state/IntlState';

import { LanguageDropdownPresenter, IViewProps } from './LanguageDropdownPresenter';
import { LanguageDropdownView } from './LanguageDropdownView';

export const LanguageDropdownContainer = (viewProps: Pick<IViewProps, 'TriggerComponent' | 'className'>) => {
  const { dependencies } = useDependencies();
  const { intlState } = useIntlState();

  return (
    <LanguageDropdownPresenter
      View={injectIntl(LanguageDropdownView)}
      intlService={dependencies.services.intl}
      intlState={intlState}
      {...viewProps}
    />
  );
};

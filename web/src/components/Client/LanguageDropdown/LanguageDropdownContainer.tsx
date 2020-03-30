import * as React from 'react';
import { injectIntl } from 'react-intl';

import { LanguageDropdownPresenter, IViewProps } from 'src/components/Client/LanguageDropdown/LanguageDropdownPresenter';
import { LanguageDropdownView } from 'src/components/Client/LanguageDropdown/LanguageDropdownView';
import { useDependencies } from 'src/DI/DI';
import { useIntlState } from 'src/state/IntlState';


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

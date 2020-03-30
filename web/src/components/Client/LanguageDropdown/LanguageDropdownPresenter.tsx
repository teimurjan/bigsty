import * as React from 'react';

import { IProps as IDropdownProps } from 'src/components/common/Dropdown/Dropdown';
import { IIntlService } from 'src/services/IntlService';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

interface IProps extends IntlStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  intlService: IIntlService;
}

export interface IViewProps {
  locales: string[];
  changeLocale: IIntlService['setLocale'];
  currentLocale: string;
  TriggerComponent?: IDropdownProps['TriggerComponent'];
  className?: string;
}

export const LanguageDropdownPresenter = ({
  View,
  intlState: { availableLocales, locale },
  intlService,
  ...viewProps
}: IProps) => {
  const changeLocale = React.useCallback(
    (newLocale: string) => {
      intlService.setLocale(newLocale);
      window.location.reload();
    },
    [intlService],
  );

  return (
    <View
      locales={availableLocales.map(({ name }) => name)}
      changeLocale={changeLocale}
      currentLocale={locale}
      {...viewProps}
    />
  );
};

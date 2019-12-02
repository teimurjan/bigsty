import * as React from "react";

import { IIntlService } from "src/services/IntlService";
import { IContextValue as IntlStateContextValue } from "src/state/IntlState";
import { setLocale } from "yup";

export interface IProps extends IntlStateContextValue {
  View: React.ComponentClass<IViewProps>;
  intlService: IIntlService;
}

export interface IViewProps {
  locales: string[];
  changeLocale: IIntlService["setLocale"];
  currentLocale: string;
}

export const LanguageDropdownPresenter = ({
  View,
  intlState: { availableLocales, locale },
  intlService
}: IProps) => {
  const changeLocale = React.useCallback(
    (newLocale: string) => {
      intlService.setLocale(newLocale);
      window.location.reload();
    },
    [setLocale]
  );

  return (
    <View
      locales={availableLocales.map(({ name }) => name)}
      changeLocale={changeLocale}
      currentLocale={locale}
    />
  );
};

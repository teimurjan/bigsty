import * as React from "react";

import { IContextValue as IntlStateContextValue } from "src/state/IntlState";

export interface IProps extends IntlStateContextValue {
  View: React.ComponentClass<IViewProps>;
}

export interface IProps {
  View: React.ComponentClass<IViewProps>;
}

export interface IViewProps {
  locales: string[];
  changeLocale: IntlStateContextValue["intlState"]["changeLocale"];
  currentLocale: string;
}

export const LanguageDropdownPresenter = ({
  View,
  intlState: { availableLocales, changeLocale, locale }
}: IProps) => (
  <View
    locales={availableLocales.map(({ name }) => name)}
    changeLocale={changeLocale}
    currentLocale={locale}
  />
);

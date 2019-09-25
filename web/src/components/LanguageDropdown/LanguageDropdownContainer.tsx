import * as React from "react";

import { injectIntl } from "react-intl";

import { injectIntlState } from "src/state/IntlState";

import { LanguageDropdownPresenter } from "./LanguageDropdownPresenter";
import { LanguageDropdownView } from "./LanguageDropdownView";

const ConnectedLanguageDropdownPresenter = injectIntlState(
  LanguageDropdownPresenter
);

export const LanguageDropdownContainer = () => (
  <ConnectedLanguageDropdownPresenter View={injectIntl(LanguageDropdownView)} />
);

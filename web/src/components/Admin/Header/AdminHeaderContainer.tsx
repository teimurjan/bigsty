import * as React from "react";

import { injectIntl } from "react-intl";

import { injectAppState } from "src/state/AppState";
import { injectUserState } from "src/state/UserState";

import { AdminHeaderPresenter } from "./AdminHeaderPresenter";
import { AdminHeaderView } from "./AdminHeaderView";

const ConnectedAdminHeaderPresenter = injectUserState(
  injectAppState(AdminHeaderPresenter)
);

export const AdminHeaderContainer = () => (
  <ConnectedAdminHeaderPresenter View={injectIntl(AdminHeaderView)} />
);

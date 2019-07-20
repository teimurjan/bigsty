import * as React from "react";

import { InjectedIntlProps } from "react-intl";

import { DeleteModal } from "../../DeleteModal";

import { IViewProps as IProps } from "./AdminFeatureTypesDeletePresenter";

export const AdminFeatureTypesDeleteView = ({
  isOpen,
  delete_,
  close,
  isLoading
}: IProps & InjectedIntlProps) => (
  <DeleteModal
    isOpen={isOpen}
    onConfirm={delete_}
    onClose={close}
    isLoading={isLoading}
  />
);

import * as React from "react";

import { InjectedIntlProps } from "react-intl";

import { DeleteModal } from "../../DeleteModal";

import { IViewProps as IProps } from "./AdminFeatureTypesDeletePresenter";

export const AdminFeatureTypesDeleteView = ({
  isOpen,
  remove,
  close,
  isLoading,
  error
}: IProps & InjectedIntlProps) => (
  <DeleteModal
    isOpen={isOpen}
    onConfirm={remove}
    onClose={close}
    isLoading={isLoading}
    error={error}
  />
);

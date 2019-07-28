import * as React from "react";

import { InjectedIntlProps } from "react-intl";

import { DeleteModal } from "../../DeleteModal";

import { IViewProps as IProps } from "./AdminCategoriesDeletePresenter";

export const AdminCategoriesDeleteView = ({
  isOpen,
  remove,
  close,
  isLoading,
  error
}: IProps & InjectedIntlProps) => (
  <DeleteModal
    error={error}
    isOpen={isOpen}
    onConfirm={remove}
    onClose={close}
    isLoading={isLoading}
  />
);

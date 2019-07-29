import * as React from "react";

import { InjectedIntlProps, injectIntl } from "react-intl";

import { CreateModal } from "../../CreateModal";
import { IntlField } from "../../IntlField";

import {
  FEATURE_TYPE_NAME_FIELD_KEY,
  IViewProps as IProps
} from "./AdminFeatureTypesCreatePresenter";

interface IFieldsProps {
  availableLocales: IProps["availableLocales"];
}

const Fields = injectIntl(
  ({ availableLocales, intl }: IFieldsProps & InjectedIntlProps) => (
    <IntlField
      key_={FEATURE_TYPE_NAME_FIELD_KEY}
      locales={availableLocales}
      label={intl.formatMessage({
        id: "AdminFeatureTypes.nameInput.label"
      })}
      placeholder={intl.formatMessage({
        id: "AdminFeatureTypes.nameInput.placeholder"
      })}
    />
  )
);

const getFieldsRenderer = (props: IFieldsProps) => () => <Fields {...props} />;

export const AdminFeatureTypesCreateView = ({
  isOpen,
  create,
  close,
  isLoading,
  error,
  intl,
  availableLocales,
  validate
}: IProps & InjectedIntlProps) => {
  console.log(validate);
  return (
    <CreateModal
      formID="adminFeatureTypesCreateForm"
      isOpen={isOpen}
      onSubmit={create}
      onClose={close}
      isLoading={isLoading}
      globalError={error}
      title={intl.formatMessage({ id: "AdminFeatureTypes.create.title" })}
      renderFields={getFieldsRenderer({ availableLocales })}
      validate={validate}
    />
  );
};

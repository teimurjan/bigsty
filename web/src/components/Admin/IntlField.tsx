import * as React from "react";

import { Field, FieldRenderProps } from "react-final-form";
import { InjectedIntl, InjectedIntlProps, injectIntl } from "react-intl";

import { IIntlListResponseItem } from "src/api/IntlAPI";
import { FormTextField } from "../common/FormTextField/FormTextField";
import { Tag } from "../common/Tag/Tag";

interface IProps {
  key_: string;
  label: string;
  placeholder: string;
  locales: IIntlListResponseItem[];
}

export const getFieldName = (
  key: string,
  locale: IIntlListResponseItem
): string => `${key}-${locale.name}-${locale.id}`;
export const parseFieldName = (
  fieldName: string
): { id: number; key: string } => {
  const splittedFieldName = fieldName.split("-");
  return {
    id: parseInt(splittedFieldName.pop() || "", 10),
    key: splittedFieldName.shift() || ""
  };
};

export const IntlField = injectIntl(
  ({ key_, label, placeholder, locales, intl }: IProps & InjectedIntlProps) => (
    <>
      {locales.map(locale => (
        <Field
          key={locale.id}
          name={getFieldName(key_, locale)}
          render={getIntlFieldRenderer({
            intl,
            label,
            locale,
            placeholder
          })}
        />
      ))}
    </>
  )
);

interface IIntlFieldRendererProps {
  label: string;
  placeholder: string;
  locale: IIntlListResponseItem;
  intl: InjectedIntl;
  defaultValue?: string;
}

const getIntlFieldRenderer = ({
  label,
  placeholder,
  locale,
  intl
}: IIntlFieldRendererProps) => ({ input, meta }: FieldRenderProps) => {
  const showError = meta.touched && meta.error;

  return (
    <FormTextField
      labelProps={{
        children: (
          <>
            {label} <Tag color="is-info">{locale.name}</Tag>
          </>
        )
      }}
      inputProps={{
        ...input,
        isDanger: showError,
        placeholder,
        type: "text"
      }}
      helpTextProps={{
        children: showError
          ? intl.formatMessage({ id: meta.error })
          : undefined,
        type: "is-danger"
      }}
    />
  );
};

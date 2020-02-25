import * as React from 'react';

import { IntlShape, injectIntl, useIntl } from 'react-intl';
import { FieldRenderProps, Field as FinalFormField } from 'react-final-form';

import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

import { Field } from 'src/components/common/Field/Field';
import { Label } from 'src/components/common/Label/Label';
import { FileInput } from 'src/components/common/FileInput/FileInput';
import { HelpText } from 'src/components/common/HelpText/HelpText';

import { IntlField } from '../../IntlField';
import { FormTextField } from 'src/components/common/FormTextField/FormTextField';

export interface IFieldsProps {
  availableLocales: IntlStateContextValue['intlState']['availableLocales'];
  textFieldKey: string;
}

const renderImageField = injectIntl(({ input, meta, intl }: FieldRenderProps<File> & { intl: IntlShape }) => {
  const showError = meta.touched && meta.error;

  return (
    <Field>
      <Label>{intl.formatMessage({ id: 'AdminProductTypes.image' })}</Label>
      <FileInput
        {...input}
        accept="image/*"
        placeholder={intl.formatMessage({
          id: 'common.chooseImage',
        })}
      />
      <HelpText type="is-danger">{showError ? intl.formatMessage({ id: meta.error }) : undefined}</HelpText>
    </Field>
  );
});

const LinkField = ({ input, meta }: FieldRenderProps<string>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;
  return (
    <FormTextField
      labelProps={{
        children: intl.formatMessage({ id: 'AdminBanners.linkInput.label' }),
      }}
      inputProps={{
        ...input,
        isDanger: showError,
        placeholder: intl.formatMessage({
          id: 'AdminBanners.linkInput.placeholder',
        }),
        type: 'text',
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
    />
  );
};

const renderLinkField = (props: FieldRenderProps<string>) => <LinkField {...props} />;

export const Fields = injectIntl(({ availableLocales, intl, textFieldKey }: IFieldsProps & { intl: IntlShape }) => (
  <>
    <IntlField
      key_={textFieldKey}
      locales={availableLocales}
      label={intl.formatMessage({
        id: 'AdminBanners.textInput.label',
      })}
      placeholder={intl.formatMessage({
        id: 'AdminBanners.textInput.placeholder',
      })}
    />
    <FinalFormField key="image" name="image" render={renderImageField} />
    <FinalFormField key="link" name="link" render={renderLinkField} />
  </>
));

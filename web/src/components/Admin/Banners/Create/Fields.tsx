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
import { isAllowedForNumberInput } from 'src/utils/number';

export interface IFieldsProps {
  availableLocales: IntlStateContextValue['intlState']['availableLocales'];
  textFieldKey: string;
  linkTextFieldKey: string;
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

const getOffsetFieldRenderer = (label: string, placeholder: string) => ({ input, meta }: FieldRenderProps<string>) => {
  const intl = useIntl();

  const showError = meta.touched && meta.error;

  return (
    <FormTextField
      labelProps={{
        children: label,
      }}
      inputProps={{
        ...input,
        isDanger: showError,
        placeholder,
        type: 'number',
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
      allowValue={isAllowedForNumberInput}
    />
  );
};

export const Fields = injectIntl(
  ({ availableLocales, intl, textFieldKey, linkTextFieldKey }: IFieldsProps & { intl: IntlShape }) => (
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
      <IntlField
        key_={linkTextFieldKey}
        locales={availableLocales}
        label={intl.formatMessage({
          id: 'AdminBanners.linkTextInput.label',
        })}
        placeholder={intl.formatMessage({
          id: 'AdminBanners.linkTextInput.placeholder',
        })}
      />
      <FinalFormField key="image" name="image" render={renderImageField} />
      <FinalFormField key="link" name="link" render={renderLinkField} />
      <FinalFormField
        key="text_top_offset"
        name="text_top_offset"
        render={getOffsetFieldRenderer(intl.formatMessage({ id: 'AdminBanners.topOffsetInput.label' }), '0')}
      />
      <FinalFormField
        key="text_bottom_offset"
        name="text_bottom_offset"
        render={getOffsetFieldRenderer(intl.formatMessage({ id: 'AdminBanners.bottomOffsetInput.label' }), '0')}
      />
      <FinalFormField
        key="text_left_offset"
        name="text_left_offset"
        render={getOffsetFieldRenderer(intl.formatMessage({ id: 'AdminBanners.leftOffsetInput.label' }), '0')}
      />
      <FinalFormField
        key="text_right_offset"
        name="text_right_offset"
        render={getOffsetFieldRenderer(intl.formatMessage({ id: 'AdminBanners.rightOffsetInput.label' }), '0')}
      />
    </>
  ),
);

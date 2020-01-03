import * as React from 'react';

import { Control, IProps as ControlProps } from '../Control/Control';
import { Field, IProps as FieldProps } from '../Field/Field';
import { HelpText, IProps as HelpTextProps } from '../HelpText/HelpText';
import { Input, IProps as InputProps } from '../Input/Input';
import { IProps as LabelProps, Label } from '../Label/Label';

interface IProps {
  controlProps?: ControlProps;
  fieldProps?: FieldProps;
  helpTextProps?: HelpTextProps;
  inputProps?: InputProps;
  labelProps?: LabelProps;
  renderInput?: () => React.ReactNode;
}

export const FormTextField = ({
  controlProps = {},
  fieldProps = {},
  inputProps = {},
  labelProps = {},
  helpTextProps = {},
  renderInput,
}: IProps) => (
  <Field {...fieldProps}>
    <Label {...labelProps} />
    <Control {...controlProps}>{renderInput ? renderInput() : <Input {...inputProps} />}</Control>
    <HelpText {...helpTextProps} />
  </Field>
);

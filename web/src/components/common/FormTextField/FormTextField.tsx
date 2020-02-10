import * as React from 'react';

import { Control, IProps as ControlProps } from '../Control/Control';
import { Field, IProps as FieldProps } from '../Field/Field';
import { HelpText, IProps as HelpTextProps } from '../HelpText/HelpText';
import { Input, IProps as InputProps } from '../Input/Input';
import { IProps as LabelProps, Label } from '../Label/Label';
import { string } from 'yup';

interface IProps {
  controlProps?: ControlProps;
  fieldProps?: FieldProps;
  helpTextProps?: HelpTextProps;
  inputProps?: InputProps;
  labelProps?: LabelProps;
  renderInput?: () => React.ReactNode;
  allowValue?: (value: string) => boolean;
}

export const FormTextField = ({
  controlProps = {},
  fieldProps = {},
  inputProps = {},
  labelProps = {},
  helpTextProps = {},
  allowValue,
  renderInput,
}: IProps) => {
  const onChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(
    e => {
      if (allowValue && !allowValue(e.currentTarget.value)) {
        return;
      }
      inputProps.onChange && inputProps.onChange(e);
    },
    [allowValue, inputProps],
  );

  return (
    <Field {...fieldProps}>
      <Label {...labelProps} />
      <Control {...controlProps}>{renderInput ? renderInput() : <Input {...inputProps} onChange={onChange} />}</Control>
      <HelpText {...helpTextProps} />
    </Field>
  );
};

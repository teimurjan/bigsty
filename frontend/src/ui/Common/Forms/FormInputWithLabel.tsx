import * as React from 'react';
import FormGroup, { FormGroupProps } from './FormGroup';
import Label, { LabelProps } from './Label';
import FormInput, { FormInputProps } from './FormInput';

interface FormInputWithLabelProps {
  labelText: string;
  labelProps?: LabelProps;
  formInputProps?: FormInputProps;
  formGroupProps?: FormGroupProps;
  formInputWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
}

export default ({
                  labelText, labelProps, formGroupProps,
                  formInputWrapperProps, formInputProps
                }: FormInputWithLabelProps) => (
  <FormGroup {...formGroupProps}>
    <Label {...labelProps}>{labelText}</Label>
    <div {...formInputWrapperProps}>
      <FormInput {...formInputProps}/>
    </div>
  </FormGroup>
);
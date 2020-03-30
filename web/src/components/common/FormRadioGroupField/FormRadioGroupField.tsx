import * as React from 'react';

import { Control, IProps as ControlProps } from 'src/components/common/Control/Control';
import { Field, IProps as FieldProps } from 'src/components/common/Field/Field';
import { HelpText, IProps as HelpTextProps } from 'src/components/common/HelpText/HelpText';
import { IProps as LabelProps, Label } from 'src/components/common/Label/Label';
import { IProps as RadioProps, Radio } from 'src/components/common/Radio/Radio';

interface IProps {
  controlProps?: ControlProps;
  fieldProps?: FieldProps;
  helpTextProps?: HelpTextProps;
  radioPropsList: RadioProps[];
  labelProps?: LabelProps;
}

export const FormRadioGroupField = ({
  controlProps = {},
  fieldProps = {},
  radioPropsList,
  labelProps = {},
  helpTextProps = {},
}: IProps) => {
  return (
    <Field {...fieldProps}>
      <Label {...labelProps} />
      <Control {...controlProps}>
        {radioPropsList.map(radioProps => (
          <Radio {...radioProps} />
        ))}
      </Control>
      <HelpText {...helpTextProps} />
    </Field>
  );
};

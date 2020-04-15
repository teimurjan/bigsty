import * as React from 'react';

import { Control, IProps as ControlProps } from 'src/components/common/Control/Control';
import { Field, IProps as FieldProps } from 'src/components/common/Field/Field';
import { HelpText, IProps as HelpTextProps } from 'src/components/common/HelpText/HelpText';
import { IProps as LabelProps, Label } from 'src/components/common/Label/Label';
import {
  IProps as NativeSelectProps,
  NativeSelect,
  NativeSelectOption,
} from 'src/components/common/NativeSelect/NativeSelect';

interface IProps {
  controlProps?: ControlProps;
  fieldProps?: FieldProps;
  helpTextProps?: HelpTextProps;
  selectProps: {
    options: Array<{ title: string; value: string }>;
    defaultOption?: { title: string };
  } & Omit<NativeSelectProps, 'children'>;
  labelProps?: LabelProps;
}

export const FormNativeSelectField = ({
  controlProps = {},
  fieldProps = {},
  selectProps,
  labelProps = {},
  helpTextProps = {},
}: IProps) => {
  const { options, defaultOption, ...selectPropsToPass } = selectProps;

  const selectOptions = [
    ...(defaultOption
      ? [
          <NativeSelectOption key="default" value="">
            {defaultOption.title}
          </NativeSelectOption>,
        ]
      : []),
    ...options.map(({ title, value }) => (
      <NativeSelectOption key={value} value={value}>
        {title}
      </NativeSelectOption>
    )),
  ];

  return (
    <Field {...fieldProps}>
      <Label {...labelProps} />
      <Control {...controlProps}>
        <NativeSelect {...selectPropsToPass}>{selectOptions}</NativeSelect>
      </Control>
      <HelpText {...helpTextProps} />
    </Field>
  );
};

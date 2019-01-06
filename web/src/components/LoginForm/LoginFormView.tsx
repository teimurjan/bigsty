/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import {
  Field,
  FieldRenderProps,
  Form,
  FormRenderProps
} from "react-final-form";
import { textCenterMixin } from "src/styles/mixins";
import { Button } from "../common/Button/Button";
import { FormTextField } from "../common/FormTextField/FormTextField";
import { HelpText } from "../common/HelpText/HelpText";
import { IViewProps as IProps } from "./LoginFormPresenter";

export class LoginFormView extends React.Component<IProps> {
  public render() {
    const { onSubmit, validate } = this.props;
    return (
      <Form
        validate={validate}
        onSubmit={onSubmit}
        render={this.renderInnerForm}
      />
    );
  }

  private renderInnerForm = ({ handleSubmit, submitting }: FormRenderProps) => {
    const { globalError } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <Field name="email" render={this.renderEmailField} />
        <Field name="password" render={this.renderPasswordField} />
        <div css={textCenterMixin}>
          <Button color="is-success" disabled={submitting} type="submit">
            Log in
          </Button>
          {globalError && <HelpText type="is-danger">{globalError}</HelpText>}
        </div>
      </form>
    );
  };

  private renderEmailField = ({ input, meta }: FieldRenderProps) => {
    const showError = meta.touched && meta.error;
    return (
      <FormTextField
        labelProps={{
          children: "Email"
        }}
        inputProps={{
          ...input,
          isDanger: showError,
          placeholder: "Enter your email",
          type: "text"
        }}
        helpTextProps={{
          children: showError ? meta.error : undefined,
          type: "is-danger"
        }}
      />
    );
  };

  private renderPasswordField = ({ input, meta }: FieldRenderProps) => {
    const showError = meta.touched && meta.error;
    return (
      <FormTextField
        labelProps={{
          children: "Password"
        }}
        inputProps={{
          ...input,
          isDanger: showError,
          placeholder: "Enter your password",
          type: "password"
        }}
        helpTextProps={{
          children: showError ? meta.error : undefined,
          type: "is-danger"
        }}
      />
    );
  };
}

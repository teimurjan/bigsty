/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import {
  Field,
  FieldRenderProps,
  Form,
  FormRenderProps
} from "react-final-form";
import { InjectedIntlProps } from "react-intl";
import { Link } from "react-router-dom";
import { textCenterMixin } from "src/styles/mixins";
import { Button } from "../../common/Button/Button";
import { FormTextField } from "../../common/FormTextField/FormTextField";
import { HelpText } from "../../common/HelpText/HelpText";
import { IViewProps as IProps } from "./SignupFormPresenter";

export class SignupFormView extends React.Component<
  IProps & InjectedIntlProps
> {
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
    const { globalError, intl } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <Field name="name" render={this.renderNameField} />
        <Field name="email" render={this.renderEmailField} />
        <Field name="password" render={this.renderPasswordField} />
        <div className="level">
          <Button
            className="level-left is-uppercase"
            color="is-success"
            disabled={submitting}
            type="submit"
          >
            {intl.formatMessage({ id: "SignupForm.submitButton.text" })}
          </Button>
          <Link to="/login" className="level-right">
            {intl.formatMessage({ id: "SignupForm.logInLink" })}
          </Link>
        </div>
        <div css={textCenterMixin}>
          {globalError && (
            <HelpText type="is-danger">
              {intl.formatMessage({ id: globalError })}
            </HelpText>
          )}
        </div>
      </form>
    );
  };

  private renderNameField = ({ input, meta }: FieldRenderProps) => {
    const { intl } = this.props;
    const showError = meta.touched && meta.error;
    return (
      <FormTextField
        labelProps={{
          children: intl.formatMessage({ id: "SignupForm.nameInput.label" })
        }}
        inputProps={{
          ...input,
          isDanger: showError,
          placeholder: intl.formatMessage({
            id: "SignupForm.nameInput.placeholder"
          }),
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

  private renderEmailField = ({ input, meta }: FieldRenderProps) => {
    const { intl } = this.props;
    const showError = meta.touched && meta.error;
    return (
      <FormTextField
        labelProps={{
          children: intl.formatMessage({ id: "SignupForm.emailInput.label" })
        }}
        inputProps={{
          ...input,
          isDanger: showError,
          placeholder: intl.formatMessage({
            id: "SignupForm.emailInput.placeholder"
          }),
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

  private renderPasswordField = ({ input, meta }: FieldRenderProps) => {
    const { intl } = this.props;
    const showError = meta.touched && meta.error;
    return (
      <FormTextField
        labelProps={{
          children: intl.formatMessage({
            id: "SignupForm.passwordInput.label"
          })
        }}
        inputProps={{
          ...input,
          isDanger: showError,
          placeholder: intl.formatMessage({
            id: "SignupForm.passwordInput.placeholder"
          }),
          type: "password"
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
}

import * as React from "react";
import {
  Field,
  FieldRenderProps,
  Form,
  FormRenderProps
} from "react-final-form";
import { IViewProps as IProps } from "./LoginFormPresenter";

class LoginFormView extends React.Component<IProps> {
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
        <button type="submit" disabled={submitting}>
          Log in
        </button>
        {globalError && <small>{globalError}</small>}
      </form>
    );
  };

  private renderEmailField = ({ input, meta }: FieldRenderProps) => (
    <div>
      <input {...input} type="text" placeholder="Email" />
      {meta.touched && meta.error && (
        <small style={{ color: "red" }}>{meta.error}</small>
      )}
    </div>
  );
  private renderPasswordField = ({ input, meta }: FieldRenderProps) => (
    <div>
      <input {...input} type="password" placeholder="Password" />
      {meta.touched && meta.error && (
        <small style={{ color: "red" }}>{meta.error}</small>
      )}
    </div>
  );
}

export default LoginFormView;

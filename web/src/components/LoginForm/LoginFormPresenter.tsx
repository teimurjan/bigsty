import * as React from "react";
import * as AuthService from "src/services/AuthService";
import * as yup from "yup";
import * as schemaValidator from "../SchemaValidator";
import LoginFormView from "./LoginFormView";

interface IProps {
  service: AuthService.IAuthService;
  view: React.ComponentClass<IViewProps>
}

export interface IViewProps {
  onSubmit: (values: { email: string; password: string }) => void;
  globalError: string | undefined;
  validate: (values: object) => object | Promise<object>;
}

interface IState {
  error: string | undefined;
  isLoading: boolean;
}

class LoginFormPresenter extends React.Component<IProps, IState> {
  public state = {
    error: undefined,
    isLoading: false
  };

  private validator: schemaValidator.ISchemaValidator;

  constructor(props: IProps) {
    super(props);
    this.validator = new schemaValidator.SchemaValidator(
      yup.object().shape({
        email: yup
          .string()
          .email("Invalid email format")
          .required("Email is required"),
        password: yup.string().required("Password is required")
      })
    );
  }

  public render() {
    const { error } = this.state;
    return (
      <LoginFormView
        onSubmit={this.onSubmit}
        globalError={error}
        validate={this.validator.validate}
      />
    );
  }

  private onSubmit = async (values: { email: string; password: string }) => {
    this.startLoading();

    const { service } = this.props;

    try {
      await service.logIn(values.email, values.password);
    } catch (e) {
      if (e instanceof AuthService.InvalidCredentialsError) {
        this.setGlobalError("Email or/and password are incorrect.");
      } else {
        this.setGlobalError("Something went wrong");
      }
    }

    this.stopLoading();
  };

  private startLoading = () =>
    this.setState({ error: undefined, isLoading: true });

  private stopLoading = () => this.setState({ isLoading: false });

  private setGlobalError = (error: string | undefined) =>
    this.setState({ error });
}

export default LoginFormPresenter;

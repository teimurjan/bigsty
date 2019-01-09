import * as React from "react";
import { RouteComponentProps } from "react-router";
import {
  IAuthService,
  InvalidCredentialsError
} from "src/services/AuthService";
import * as yup from "yup";
import { IContextValue as UserStateContextValue } from "../../../state/UserState";
import * as schemaValidator from "../../SchemaValidator";

export interface IProps
  extends RouteComponentProps<any>,
    UserStateContextValue {
  authService: IAuthService;
  View: React.ComponentClass<IViewProps>;
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

export class LoginFormPresenter extends React.Component<IProps, IState> {
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
          .email("LoginForm.errors.email.format")
          .required("LoginForm.errors.email.empty"),
        password: yup.string().required("LoginForm.errors.password.empty")
      })
    );
  }

  public render() {
    const { error } = this.state;
    const { View } = this.props;
    return (
      <View
        onSubmit={this.onSubmit}
        globalError={error}
        validate={this.validator.validate}
      />
    );
  }

  private onSubmit = async (values: { email: string; password: string }) => {
    this.startLoading();

    const { authService, history, userState } = this.props;

    try {
      await authService.logIn(values.email, values.password);
      userState.syncUser();

      this.stopLoading();

      history.push("/");
    } catch (e) {
      if (e instanceof InvalidCredentialsError) {
        this.setGlobalError("LoginForm.errors.invalidCredentials");
      } else {
        this.setGlobalError("errors.common");
      }
      this.stopLoading();
    }
  };

  private startLoading = () =>
    this.setState({ error: undefined, isLoading: true });

  private stopLoading = () => this.setState({ isLoading: false });

  private setGlobalError = (error: string | undefined) =>
    this.setState({ error });
}

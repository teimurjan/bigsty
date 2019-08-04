import * as React from "react";

import { RouteComponentProps } from "react-router";
import * as yup from "yup";

import * as schemaValidator from "src/components/SchemaValidator";
import * as authService from "src/services/AuthService";
import { IContextValue as UserStateContextValue } from "src/state/UserState";

export interface IProps
  extends RouteComponentProps<any>,
    UserStateContextValue {
  service: authService.IAuthService;
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

export class SignUpFormPresenter extends React.Component<IProps, IState> {
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
          .email("SignUpForm.errors.email.format")
          .required("SignUpForm.errors.email.empty"),
        name: yup.string().required("SignUpForm.errors.name.empty"),
        password: yup
          .string()
          .matches(
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
            "SignUpForm.errors.password.regex"
          )
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

  private onSubmit = async (values: {
    email: string;
    name: string;
    password: string;
  }) => {
    this.startLoading();

    const { service, history, userState } = this.props;

    try {
      await service.signUp(values.name, values.email, values.password);
      userState.syncUser();

      this.stopLoading();

      history.push("/");
    } catch (e) {
      if (e instanceof authService.errors.EmailExistsError) {
        this.setGlobalError("SignUpForm.errors.emailExists");
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

import * as React from 'react';
import {Link} from "react-router";
import {InjectIntl, IntlProps} from "../Common/InjectIntl";
import FormInput from "../Common/Forms/FormInput";
import FormGroup from "../Common/Forms/FormGroup";
import {getFieldErrorFromProps} from "../Common/errors";
import {ActionCreator} from "redux";

export interface LoginProps {
  email: string,
  password: string,
  isLoading: boolean,
  errors?: object,
  actions: {
    changeEmail: ActionCreator<string>
    changePassword: ActionCreator<string>
    submit: ActionCreator<any>
  }
}

const Login: React.SFC<LoginProps & IntlProps> = props => {
  const handleEmailChange = (e: React.FormEvent<HTMLInputElement>) => props.actions.changeEmail(e.currentTarget.value);
  const handlePasswordChange = (e: React.FormEvent<HTMLInputElement>) => props.actions.changePassword(e.currentTarget.value);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.actions.submit();
  };

  const getError = getFieldErrorFromProps.bind(null, props);
  const {email, password, intl, isLoading, errors} = props;
  const authError = getError('auth');
  return (
    <div>
      <div className="middle-box text-center loginscreen animated fadeInDown">
        <div>
          <Link to="/"><h1 className="logo-name">M</h1></Link>
          <form className="m-t" onSubmit={handleSubmit} noValidate>
            <FormGroup error={getError('email')}>
              <FormInput email value={email} onChange={handleEmailChange}
                         placeholder={intl('auth.placeholder.email')}/>
            </FormGroup>
            <FormGroup error={getError('password')}>
              <FormInput password value={password} onChange={handlePasswordChange}
                         placeholder={intl('auth.placeholder.password')}/>
            </FormGroup>
            <button disabled={isLoading} type="submit"
                    className={`btn btn-${errors ? 'danger' : 'primary'} block full-width m-b-sm`}>
              {intl('auth.button.logIn')}
            </button>
            {authError &&
            <div className="m-b-sm">
              <small className="text-danger">{authError}</small>
              <br/>
            </div>}
            <Link to="/password/forgot">
              <small>{intl('login.link.forgot')}</small>
              <br/>
            </Link>
            <p className="text-muted text-center">
              <small>{intl('login.text.noAccount')}</small>
            </p>
            <Link className="btn btn-sm btn-white btn-block" to="/register">
              {intl('auth.button.register')}
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InjectIntl(Login);
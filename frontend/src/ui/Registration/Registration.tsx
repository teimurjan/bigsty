import * as React from 'react';
import {Link} from 'react-router';
import {InjectIntl, IntlProps} from '../Common/InjectIntl';
import FormInput from '../Common/Forms/FormInput';
import FormGroup from '../Common/Forms/FormGroup';
import {getFieldErrorFromProps} from '../Common/errors';
import {ActionCreator} from 'redux';

export interface RegistrationProps {
  name: string,
  email: string,
  password: string,
  isLoading: boolean,
  errors?: object,
  actions: {
    changeName: ActionCreator<string>
    changeEmail: ActionCreator<string>
    changePassword: ActionCreator<string>
    submit: ActionCreator<string>
  }
}


const Registration: React.SFC<RegistrationProps & IntlProps> = props => {
  const handleNameChange = (e: React.FormEvent<HTMLInputElement>) => props.actions.changeName(e.currentTarget.value);
  const handleEmailChange = (e: React.FormEvent<HTMLInputElement>) => props.actions.changeEmail(e.currentTarget.value);
  const handlePasswordChange = (e: React.FormEvent<HTMLInputElement>) => props.actions.changePassword(e.currentTarget.value);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.actions.submit();
  };

  const getError = getFieldErrorFromProps.bind(null, props);

  const {email, password, name, intl, isLoading, errors} = props;
  return (
    <div>
      <div className="middle-box text-center loginscreen animated fadeInDown">
        <div>
          <Link to="/"><h1 className="logo-name">M</h1></Link>
          <form className="m-t" onSubmit={handleSubmit} noValidate>
            <FormGroup error={getError("name")}>
              <FormInput value={name} onChange={handleNameChange}
                         placeholder={intl("registration.placeholder.name")}/>
            </FormGroup>
            <FormGroup error={getError("email")}>
              <FormInput email value={email} onChange={handleEmailChange}
                         placeholder={intl("auth.placeholder.email")}/>
            </FormGroup>
            <FormGroup error={getError("password")}>
              <FormInput password value={password} onChange={handlePasswordChange}
                         placeholder={intl("auth.placeholder.password")}/>
            </FormGroup>
            <button disabled={isLoading} type="submit"
                    className={`btn btn-${errors ? "danger" : "primary"} block full-width m-b-sm`}>
              {intl("auth.button.register")}
            </button>
            <p className="text-muted text-center">
              <small>{intl("registration.text.haveAccount")}</small>
            </p>
            <Link className="btn btn-sm btn-white btn-block" to="/login">
              {intl("auth.button.logIn")}
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InjectIntl(Registration);
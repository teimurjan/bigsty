import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router";
import {InjectIntl} from "../Common/InjectIntl";
import FormInput from "../Common/Forms/FormInput";
import FormGroup from "../Common/Forms/FormGroup";

const Login = props => {
  const handleEmailChange = e => props.actions.changeEmail(e.target.value);
  const handlePasswordChange = e => props.actions.changePassword(e.target.value);
  const handleSubmit = e => {
    e.preventDefault();
    props.actions.submit();
  };

  const getError = field => {
    const {errors, intl} = props;
    if (!errors) {
      return false;
    } else {
      const errorCodes = errors[field];
      return errorCodes && errorCodes.length > 0 ? intl(errorCodes[0]) : false;
    }
  };

  const {email, password, intl, isLoading, errors} = props;
  const emailError = getError('email');
  const passwordError = getError('password');
  const authError = getError('auth');
  return (
    <div>
      <div className="middle-box text-center loginscreen animated fadeInDown">
        <div>
          <Link to="/"><h1 className="logo-name">M</h1></Link>
          <form className="m-t" onSubmit={handleSubmit} noValidate>
            <FormGroup error={emailError}>
              <FormInput email value={email} onChange={handleEmailChange}
                         placeholder={intl('login.placeholder.email')}/>
            </FormGroup>
            <FormGroup error={passwordError}>
              <FormInput password value={password} onChange={handlePasswordChange}
                         placeholder={intl('login.placeholder.password')}/>
            </FormGroup>
            <button disabled={isLoading} type="submit"
                    className={`btn btn-${errors ? 'danger' : 'primary'} block full-width m-b-sm`}>
              {intl('login.button.submit')}
            </button>
            {authError && <div className="m-b-sm">
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
              {intl('login.link.register')}
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  errors: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  actions: PropTypes.shape({
    changeEmail: PropTypes.func.isRequired,
    changePassword: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired
  }).isRequired
};

export default InjectIntl(Login);
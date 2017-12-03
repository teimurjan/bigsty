import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router";
import {InjectIntl} from "../Common/InjectIntl";
import FormInput from "../Common/Forms/FormInput";
import FormGroup from "../Common/Forms/FormGroup";
import {getFieldErrorFromProps} from "../Common/errors";

const Registration = props => {
  const handleNameChange = e => props.actions.changeName(e.target.value);
  const handleEmailChange = e => props.actions.changeEmail(e.target.value);
  const handlePasswordChange = e => props.actions.changePassword(e.target.value);
  const handleSubmit = e => {
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
            <FormGroup error={getError('name')}>
              <FormInput value={name} onChange={handleNameChange}
                         placeholder={intl('registration.placeholder.name')}/>
            </FormGroup>
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
              {intl('auth.button.register')}
            </button>
            <p className="text-muted text-center">
              <small>{intl('registration.text.haveAccount')}</small>
            </p>
            <Link className="btn btn-sm btn-white btn-block" to="/login">
              {intl('auth.button.logIn')}
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

Registration.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  errors: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  actions: PropTypes.shape({
    changeEmail: PropTypes.func.isRequired,
    changeName: PropTypes.func.isRequired,
    changePassword: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired
  }).isRequired
};

export default InjectIntl(Registration);
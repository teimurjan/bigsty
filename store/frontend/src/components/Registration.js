import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router";
import Spinner from "./utils/Spinner";

class Registration extends React.Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired,
        is_loading: PropTypes.bool.isRequired,
        errors: PropTypes.object.isRequired,
        actions: PropTypes.shape({
            register: PropTypes.func.isRequired,
            changeName: PropTypes.func.isRequired,
            changeEmail: PropTypes.func.isRequired,
            changePassword: PropTypes.func.isRequired
        }).isRequired
    };

    componentWillMount() {
        document.body.classList.add("gray-bg");
    }

    componentWillUnmount() {
        document.body.classList.remove("gray-bg")
    }

    handleNameChange = (e) => this.props.actions.changeName(e.target.value);

    handleEmailChange = (e) => this.props.actions.changeEmail(e.target.value);

    handlePasswordChange = (e) => this.props.actions.changePassword(e.target.value);

    handleFormSubmit = (e) => {
        e.preventDefault();
        this.props.actions.register();
    };

    hasFieldErrors = (fieldName) => this.props.errors[fieldName].length > 0;

    formGroupClassName = (fieldName) => `form-group ${this.hasFieldErrors(fieldName) ? 'has-error' : ''}`;

    render() {
        const {name, email, password, errors} = this.props;
        return (
            <div className="middle-box text-center loginscreen   animated fadeInDown">
                <div>
                    <h2>Welcome to My Shop</h2>
                    <p>Create account to see it in action.</p>
                    <form className="m-t" role="form" onSubmit={this.handleFormSubmit}>
                        <div className={this.formGroupClassName('name')}>
                            <input onChange={this.handleNameChange} name='name' type="text"
                                   className='form-control'
                                   placeholder="Name" required={true} value={name}/>
                            {this.hasFieldErrors('name') &&
                            <small className="text-danger help-block m-b-none">{errors.name[0]}</small>}
                        </div>
                        <div className={this.formGroupClassName('email')}>
                            <input onChange={this.handleEmailChange} name='email' type="email"
                                   className='form-control'
                                   placeholder="Email" required={true} value={email}/>
                            {this.hasFieldErrors('email') &&
                            <small className="text-danger help-block m-b-none">{errors.email[0]}</small>}
                        </div>
                        <div className={this.formGroupClassName('password')}>
                            <input onChange={this.handlePasswordChange} name='password' type="password"
                                   className='form-control'
                                   placeholder="Password" required={true} value={password}/>
                            {this.hasFieldErrors('password') &&
                            <small className="text-danger help-block m-b-none">{errors.password[0]}</small>}
                        </div>
                        <button type="submit" className="btn btn-primary block full-width m-b-xs">Register
                        </button>
                        <Spinner isActive={this.props.is_loading}/>
                        <p className="text-muted text-center">
                            <small>Already have an account?</small>
                        </p>
                        <button className="btn btn-sm btn-white btn-block"><Link className="text-primary" style={{
                            height: '100%', width: '100%', display: 'block'
                        }} to="/login">Login</Link>
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default Registration;

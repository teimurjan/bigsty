import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router";

class Error extends React.Component {
    static propTypes = {
        errorCode: PropTypes.string.isRequired,
        errorText: PropTypes.string.isRequired,
        errorDescription: PropTypes.string.isRequired
    };

    componentWillMount() {
        document.body.classList.add("gray-bg");
    }

    componentWillUnmount() {
        document.body.classList.remove("gray-bg")
    }

    render() {
        const {
            errorCode,
            errorText,
            errorDescription,
        } = this.props;
        return (
            <div className="middle-box text-center animated fadeInDown">
                <h1>{errorCode}</h1>
                <h3 className="font-bold">{errorText}</h3>
                <div className="error-desc">
                    {errorDescription}
                    <br/>
                    <Link to="/">
                        <button className="m-t-md btn btn-primary">Back to the site</button>
                    </Link>
                </div>
            </div>
        );
    }
}

export default Error;

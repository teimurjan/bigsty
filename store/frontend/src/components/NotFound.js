import React from 'react';
import {Link} from "react-router";
import Error from "./Error";

class NotFound extends React.Component {

    render() {
        return (
            <Error errorCode="404"
                   errorText="Not Found"
                   errorDescription="Sorry, but the page you are looking for has note been found.
                   Try checking the URL for error, then hit the refresh button on your browser."/>
        );
    }
}

export default NotFound;

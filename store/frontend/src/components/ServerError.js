import React from 'react';
import Error from "./Error";

class ServerError extends React.Component {

    render() {
        return (
            <Error errorCode="500"
                   errorText="Server Error"
                   errorDescription="The server encountered something unexpected that didn't allow it to complete the request.
                   We apologize. You can go back to main page:"/>
        );
    }
}

export default ServerError;

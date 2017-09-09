import React from 'react';
import Error from "./Error";

class Forbidden extends React.Component {

    render() {
        return (
            <Error errorCode="403"
                   errorText="Forbidden"
                   errorDescription="You don't have permissions to view this page."/>
        );
    }
}

export default Forbidden;

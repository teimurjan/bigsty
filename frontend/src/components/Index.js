import React from 'react';
import mi from '../assets/images/carousel/mi.jpg';


class Index extends React.Component {

    render() {
        const billboardStyle = {
            backgroundImage: `url(${mi})`, minHeight: '100vh',
            backgroundPosition: 'center top', backgroundSize: 'cover'
        };
        return (
            <div className="text-center landing-page" style={billboardStyle}>
                <div className="p-lg m-t-lg carousel-caption">
                    <h1>Beyond the bounds - <br/>Xiaomi Mi Mix</h1>
                    <button className="btn btn-primary btn-w-m">
                        Learn more
                    </button>
                </div>
            </div>
        );
    }
}

export default Index;

import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router";


class Index extends React.Component {
    static propTypes = {};

    render() {
        return (
            <div className="text-center">
                <div className="row">
                    <h1 className="p-md">Choose your category</h1>
                </div>
                <div className="row">
                    <div className="col-lg-12 m-t-md">
                        <div className="col-lg-3">
                            <button className="btn btn-primary btn-outline btn-circle btn-xl"><i
                                className="fa fa-laptop"/>
                            </button>
                            <h4 className="m-t-sm ">Laptops</h4>
                        </div>
                        <div className="col-lg-3">
                            <button className="btn btn-primary btn-outline btn-circle btn-xl"><i
                                className="fa fa-headphones"/></button>
                            <h4 className="m-t-sm ">Headphones</h4>
                        </div>
                        <div className="col-lg-3">
                            <Link to="categories/1"><button className="btn btn-primary btn-outline btn-circle btn-xl"><i
                                className="fa fa-mobile-phone"/></button></Link>
                            <h4 className="m-t-sm ">Phones</h4>
                        </div>
                        <div className="col-lg-3">
                            <button className="btn btn-primary btn-outline btn-circle btn-xl"><i
                                className="fa fa-wifi"/></button>
                            <h4 className="m-t-sm ">Network</h4>
                        </div>
                    </div>
                    <div className="col-lg-12 m-t-md">
                        <div className="col-lg-3">
                            <button className="btn btn-primary btn-outline btn-circle btn-xl"><i
                                className="fa fa-camera"/></button>
                            <h4 className="m-t-sm ">Cameras</h4>
                        </div>
                        <div className="col-lg-3">
                            <button className="btn btn-primary btn-outline btn-circle btn-xl"><i
                                className="fa fa-car"/></button>
                            <h4 className="m-t-sm ">Car accessories</h4>
                        </div>
                        <div className="col-lg-3">
                            <button className="btn btn-primary btn-outline btn-circle btn-xl"><i
                                className="fa fa-gift"/></button>
                            <h4 className="m-t-sm ">Accessories</h4>
                        </div>
                        <div className="col-lg-3">
                            <button className="btn btn-primary btn-outline btn-circle btn-xl"><i
                                className="fa fa-heart-o"/></button>
                            <h4 className="m-t-sm ">Sport</h4>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Index;

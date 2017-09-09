import React from 'react';
import PropTypes from 'prop-types';
import Spinner from "./Spinner";

const SpinnerWrapper = props => (
  <div className="ibox">
    <div className={`ibox-content ${props.isActive ? 'sk-loading' : ''}`}>
      <Spinner {...props}/>
      {props.children}
    </div>
  </div>
);

SpinnerWrapper.propTypes = {
  isActive: PropTypes.bool.isRequired,
  color: PropTypes.string,
};

export default SpinnerWrapper;

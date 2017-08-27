import React from 'react';
import PropTypes from 'prop-types';

class SpinnerWrapper extends React.Component {
  static propTypes = {
    isActive: PropTypes.bool.isRequired,
    color: PropTypes.string,
  };

  renderSpinner() {
    const {isActive, color} = this.props;
    const visibility = isActive ? 'visiblie' : 'hidden';
    return (
      <div style={{visibility}}
           className={`sk-spinner sk-spinner-fading-circle ${color ? `sk-${color}` : ''}`}>
        <div className="sk-circle1 sk-circle"/>
        <div className="sk-circle2 sk-circle"/>
        <div className="sk-circle3 sk-circle"/>
        <div className="sk-circle4 sk-circle"/>
        <div className="sk-circle5 sk-circle"/>
        <div className="sk-circle6 sk-circle"/>
        <div className="sk-circle7 sk-circle"/>
        <div className="sk-circle8 sk-circle"/>
        <div className="sk-circle9 sk-circle"/>
        <div className="sk-circle10 sk-circle"/>
        <div className="sk-circle11 sk-circle"/>
        <div className="sk-circle12 sk-circle"/>
      </div>
    );
  }

  render() {
    const {isActive, children} = this.props;
    return (
      <div className="ibox">
        <div className={`ibox-content ${isActive ? 'sk-loading' : ''}`}>
          {this.renderSpinner()}
          {children}
        </div>
      </div>
    );
  }
}

export default SpinnerWrapper;

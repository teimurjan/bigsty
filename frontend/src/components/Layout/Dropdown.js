import React from 'react';


export default class Dropdown extends React.Component {
    state = {
        open: false
    };

    open = (e) => {
        e.preventDefault();
        this.setState({open: true});
    };

    close = (e) => {
        e.preventDefault();
        this.setState({open: false});
    };

    render() {
        return (
            <li onMouseLeave={this.close} className={`dropdown ${this.state.open ? 'open' : ''}`}>
                <a onMouseEnter={this.open} aria-expanded={this.state.open} role="button" href="#"
                   className="dropdown-toggle"
                   data-toggle="dropdown"> Categories <span className="caret"/></a>
                <ul role="menu" className="dropdown-menu">
                    {this.props.children}
                </ul>
            </li>
        )
    }
}
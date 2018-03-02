import React, { Component } from 'react';

class DashboardPage extends Component {
  componentDidMount() {
    const elem = document.querySelector('.parallax');
    const instance = M.Parallax.init(elem);
  }

  render() {
    return (
      <div>
        <div className="parallax-container valign-wrapper" style={{ height: "400px" }}>
          <div className="row center">
          </div>
          <div className="parallax"><img src="https://i.imgur.com/6OiVyuZ.jpg" alt="" /></div>
        </div>

        <div className="container">
          <h1 className="header center blue-text">Dashboard Page</h1>
          <div className="row center">
            <h5 className="header col s12 light">A modern responsive webpage based on NodeJS, ReactJS, MongoDB and Material Design</h5>
          </div>
          <div className="row center">
            <i className="material-icons blue-text" style={{ fontSize: "244px" }}>cloud</i>
          </div>
        </div>
      </div>
    );
  }
}

export default DashboardPage;

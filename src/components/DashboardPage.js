import React, { Component } from 'react';

class DashboardPage extends Component {
  render() {
    return (
      <div className="container">
        <h1 className="header center blue-text">Dashboard Page</h1>
        <div className="row center">
          <h5 className="header col s12 light">A modern responsive webpage based on NodeJS, ReactJS, MongoDB and Material Design</h5>
        </div>
        <div className="row center">
          <i className="material-icons blue-text" style={{fontSize: "244px"}}>cloud</i>
        </div>
      </div>
    );
  }
}

export default DashboardPage;

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { startLogout } from '../actions/auth';

import { firebase } from '../firebase/firebase';

export class Header extends React.Component {
  componentDidMount() {
    this.handleSideNav();
  }

  handleSideNav() {
    //side-nav
    var elem = document.querySelector('.sidenav');
    var sideNavInstance = M.Sidenav.init(elem);
  }

  render() {
    const user = firebase.auth().currentUser;
    const { location } = this.props;

    return (
      <div>
        <nav className="light-blue lighten-1" role="navigation">
          <div className="nav-wrapper container">
            <a id="logo-container" className="brand-logo"><i className="material-icons">work</i>FU Insight</a>
            <ul className="right hide-on-med-and-down">
              <li className={location === "/dashboard/" ? "active" : ""}>
                <Link to={`/dashboard/`}><i className="material-icons left">dashboard</i>Dashboard</Link>
              </li>
              <li className={location === "/chat/" ? "active" : ""}>
                <Link to={`/chat/`}><i className="material-icons left">chat_bubble</i>Chat</Link>
              </li>
              <li>
                <a href="#" onClick={startLogout()}>Logout</a>
              </li>
            </ul>

            <ul id="nav-mobile" className="sidenav">
              <li>
                <a href="#"><i className="material-icons">work</i>FPTU HCM Insight</a>
              </li>
              <li>
                <div className="divider"></div>
              </li>
              <li>
                <a className="subheader">Menu</a>
              </li>
              <li className={location === "/dashboard/" ? "active" : ""}>
                <a href="/dashboard/">Dashboard</a>
              </li>
              <li className={location === "/chat/" ? "active" : ""}>
                <a href="/chat/">Chat</a>
              </li>
              <li>
                <a href="#" onClick={startLogout()}>Logout</a>
              </li>
            </ul>

            <a href="#" data-target="nav-mobile" className="sidenav-trigger">
              <i className="material-icons">menu</i>
            </a>
          </div>
        </nav>

        <div className="tap-target cyan" data-target="menu">
          <div className="tap-target-content white-text">
            <h5><i className="material-icons left">cloud</i>Developer Guide</h5>
            <p>Hi, this is just the beta version. Please click Report Bug if any bug.</p>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  startLogout: () => dispatch(startLogout())
});

export default connect(undefined, mapDispatchToProps)(Header);

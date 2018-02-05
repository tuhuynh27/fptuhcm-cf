import React, { Component } from 'react';
import { connect } from 'react-redux';
import { startGoogleLogin, startEmailLogin, startEmailSignup } from '../actions/auth';

export class LoginPage extends Component {
  handleEmailLogin(signup) {
    if (this.refs.email.value === "" || this.refs.password.value === "") {
      M.toast({ html: "Please enter your Email and Password!", classes: "rounded" });
    } else {
      if (signup) {
        startEmailSignup(this.refs.email.value, this.refs.password.value, (error) => {
          M.toast({ html: error, classes: "rounded" });
        });
      } else {
        startEmailLogin(this.refs.email.value, this.refs.password.value, (error) => {
          M.toast({ html: error, classes: "rounded" });
        });
      }
    }
  }

  render() {
    return (
      <div className="container">
        <h1 className="header center blue-text">Cloud Application</h1>
        <div className="row center">
          <h5 className="header col s12 light">Sorry, guest has no access permission. Login to explore the whole app.</h5>
        </div>
        <div className="row center">
          <button className="btn-large waves-effect waves-light blue" onClick={startGoogleLogin()}><i className="material-icons left">account_circle</i>Login with Google account</button>
        </div>
        <div className="row">
          <div className="col s12 m6 offset-m3">
            <div className="card white darken-1 hoverable">
              <div className="card-content black-text">
                <div className="card-title blue-text">Login / Signup with email and password</div>
                <div className="input-field ">
                  <input id="email" ref="email" type="email" />
                  <label htmlFor="email">Email</label>
                </div>
                <div className="input-field ">
                  <input id="password" ref="password" type="password" />
                  <label htmlFor="password">Password</label>
                </div>
                <div className="card-action center">
                  <button className="btn waves-effect waves-light green" onClick={() => this.handleEmailLogin()}><i className="material-icons left">cloud_done</i>Login</button>
                  &nbsp;
                  <button className="btn waves-effect waves-light pink" onClick={() => this.handleEmailLogin(true)}><i className="material-icons left">cloud_upload</i>Signup</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="divider"></div>
        <div className="row center">
          <p>Copyright &copy; 2018 Huynh Minh Tu.</p>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  startLogin: () => dispatch(startLogin())
});

export default connect(undefined, mapDispatchToProps)(LoginPage);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { startGoogleLogin, startEmailLogin, startEmailSignup } from '../actions/auth';

import { database } from '../firebase/firebase';

import Footer from '../components/Footer';

export class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoginMode: false,
      isConfessSent: false,
      modalMessage: ""
    };
  }

  handleEmailLogin(e, signup) {
    e.preventDefault();

    const elem = document.querySelector('.modal');
    const option = {
      opacity: 0.8,
      dismissible: false
    };
    const instance = M.Modal.init(elem, option);

    if (this.refs.email.value === "" || this.refs.password.value === "") {
      this.setState({
        modalMessage: "Please enter your Email and Password!"
      });
      instance.open();
    } else {
      if (signup) {
        startEmailSignup(this.refs.email.value, this.refs.password.value, (error) => {
          this.setState({
            modalMessage: error.message
          });
          instance.open();
        });
      } else {
        startEmailLogin(this.refs.email.value, this.refs.password.value, () => {
          M.toast({ html: "Thank you for loggged in, you are a", classes: "rounded" });
        }, (error) => {
          this.setState({
            modalMessage: error.message
          });
          instance.open();
        });
      }
    }
  }

  handleChangeMode() {
    this.setState({
      isLoginMode: !this.state.isLoginMode
    });
  }

  handleCloseModal(e) {
    e.preventDefault();

    const elem = document.querySelector('.modal');
    const instance = M.Modal.getInstance(elem);

    instance.close();
  }

  handleSendConfess() {
    const elem = document.querySelector('.modal');
    const option = {
      opacity: 0.8,
      dismissible: false
    };
    const instance = M.Modal.init(elem, option);


    if (this.refs.message.value === "") {
      this.setState({
        modalMessage: "Please enter something to send!"
      });
      instance.open();
    } else {
      const confessRef = database.ref("confess");
      const data = {
        message: this.refs.message.value,
        time: new Date().toLocaleString(),
        status: 0,
        approver: "",
        reason: "",
        hide: false
      };

      confessRef.push(data);

      M.toast({ html: "Confession sent!, waiting approve by admin, thank you!", classes: "rounded" });

      this.setState({
        isConfessSent: true
      });
    }
  }

  handleImageUpload() {
    const elem = document.querySelector('.modal');
    const option = {
      opacity: 0.8,
      dismissible: false
    };
    const instance = M.Modal.init(elem, option);

    this.setState({
      modalMessage: "You can go to some online image upload to upload your image, then paste the image url into the confessions message."
    });
    instance.open();
  }


  render() {
    const { isLoginMode } = this.state;

    if (isLoginMode) {
      return (
        <div>
          <div className="container">
            <div className="row center">
              <img src="http://imagizer.imageshack.us/a/img923/2498/D2xGjq.png" width="50%" />
            </div>
            <div className="row center">
              <h5 className="header col s12 light">Sorry, guest has no access permission. You must be a staff of FUHCM Confessions.</h5>
            </div>
            {/* <div className="row center">
              <button className="btn-large waves-effect waves-light blue" onClick={startGoogleLogin()}><i className="material-icons left">account_circle</i>Login with Google account</button>
            </div> */}
            <div className="row">
              <div className="col s12 m8 offset-m2">
                <div className="card white darken-1 hoverable">
                  <div className="card-content black-text">
                    <div className="card-title blue-text">Login with email and password</div>
                    <form onSubmit={(e) => this.handleEmailLogin(e)}>
                      <div className="input-field ">
                        <input id="email" ref="email" type="email" />
                        <label htmlFor="email">Email</label>
                      </div>
                      <div className="input-field ">
                        <input id="password" ref="password" type="password" />
                        <label htmlFor="password">Password</label>
                      </div>
                      <div className="card-action center">
                        <button className="btn waves-effect waves-light blue" onClick={(e) => this.handleEmailLogin(e)}><i className="material-icons left">cloud_done</i>Login</button>
                        &nbsp;
                  {/* <button className="btn waves-effect waves-light pink" onClick={() => this.handleEmailLogin(true)}><i className="material-icons left">cloud_upload</i>Signup</button> */}
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="row">
                <button className="btn waves-effect waves-light green right" onClick={() => this.handleChangeMode()}><i className="material-icons left">chevron_left</i>Back to Send Confession</button>
              </div>
            </div>

          </div>
          <Footer />

          <div id="login" className="modal">
            <div className="modal-content">
              <h4>FUHCM Confession AdminCP Error!</h4>
              <p>{this.state.modalMessage}</p>
            </div>
            <div className="modal-footer">
              <a className="modal-action modal-close waves-effect waves-green btn-flat" onClick={(e) => this.handleCloseModal(e)}>I know</a>
            </div>
          </div>
        </div>
      );
    } else {
      const { isConfessSent } = this.state;

      return (
        <div>
          <div className="container">
            <div className="row center">
              <img src="http://imagizer.imageshack.us/a/img923/2498/D2xGjq.png" width="50%" />
            </div>
            <div className="row">
              <p className="col s8 offset-s2 light">"Lost love is still love. It takes a different form, that's all. You can't see their smile or bring them food or tousle their hair or move them around a dance floor. But when those senses weaken another heightens. Memory. Memory becomes your partner. You nurture it. You hold it. You dance with it."</p>
            </div>
            <div className="row">
              <div className="col s12 m8 offset-m2">
                <div className="card white darken-1 hoverable">
                  <div className={`card-content black-text ${isConfessSent ? "hide" : null}`}>
                    <div className="card-title blue-text">Make Your Confess</div>
                    <div className="input-field ">
                      <textarea id="message" ref="message" className="materialize-textarea" style={{ height: "200px" }}></textarea>
                      <label htmlFor="message">Confess Message</label>
                    </div>
                    <div className="row center">
                      <div className="col s12 m6">
                        <button className="btn waves-effect waves-light green" onClick={() => this.handleSendConfess()}><i className="material-icons left">check</i>Be brave, send It!</button>
                      </div>
                      <div className="col s12 m6">
                        <button className="btn waves-effect waves-light orange" onClick={() => this.handleImageUpload()}><i className="material-icons left">file_upload</i>Add Image</button>
                      </div>
                    </div>
                  </div>
                  <div className={`card-content black-text ${!isConfessSent ? "hide" : null}`}>
                    <div className="card-title blue-text">Your confess has been sent!</div>
                    <div>Thank you! If your confess is valid, it will be available on fanpage soon!</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <button className="btn waves-effect waves-light blue right" onClick={() => this.handleChangeMode()}><i className="material-icons left">chevron_right</i>Login to FUHCM Confession Insight</button>
            </div>
          </div>
          <Footer />

          <div id="login" className="modal">
            <div className="modal-content">
              <h4>FUHCM Confess report an error!</h4>
              <p>{this.state.modalMessage}</p>
            </div>
            <div className="modal-footer">
              <a className="modal-action modal-close waves-effect waves-green btn-flat" onClick={(e) => this.handleCloseModal(e)}>I know</a>
            </div>
          </div>
        </div>
      );
    }
  }
}

const mapDispatchToProps = (dispatch) => ({
  startLogin: () => dispatch(startLogin())
});

export default connect(undefined, mapDispatchToProps)(LoginPage);

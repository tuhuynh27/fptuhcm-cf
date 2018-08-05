import React, { Component } from "react";
import { connect } from "react-redux";
import {
  startGoogleLogin,
  startEmailLogin,
  startEmailSignup
} from "../actions/auth";

import { database } from "../firebase/firebase";

import Footer from "../components/Footer";

const shortid = require('shortid');

export class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoginMode: false,
      isConfessSent: false,
      isConfessSearch: false,
      modalMessage: "",
      shortID: "Not generated",
      searchErr: false,
      searchDone: false,
      searchObj: {}
    };
  }

  handleEmailLogin(e, signup) {
    e.preventDefault();

    const elem = document.querySelector(".modal");
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
        startEmailSignup(
          this.refs.email.value,
          this.refs.password.value,
          error => {
            this.setState({
              modalMessage: error.message
            });
            instance.open();
          }
        );
      } else {
        startEmailLogin(
          this.refs.email.value,
          this.refs.password.value,
          error => {
            this.setState({
              modalMessage: error.message
            });
            instance.open();
          }
        );
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

    const elem = document.querySelector(".modal");
    const instance = M.Modal.getInstance(elem);

    instance.close();
  }

  handleSendConfess() {
    const elem = document.querySelector(".modal");
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
      const shortID = shortid.generate();
      const data = {
        message: this.refs.message.value,
        time: new Date().toLocaleString(),
        status: 0,
        approver: "",
        reason: "",
        hide: false,
        id: 0,
        shortID: shortID
      };

      confessRef.push(data);

      M.toast({
        html: "Confession sent!, waiting approve by admin, thank you!",
        classes: "rounded"
      });

      this.setState({
        isConfessSent: true,
        shortID: shortID
      });
    }
  }

  handleImageUpload() {
    const elem = document.querySelector(".modal");
    const option = {
      opacity: 0.8,
      dismissible: false
    };
    const instance = M.Modal.init(elem, option);

    this.setState({
      modalMessage:
        "You can go to some online image upload to upload your image, then paste the image url into the confessions message."
    });
    instance.open();
  }

  handleOpenSearch() {
    this.setState({
      isConfessSearch: !this.state.isConfessSearch
    });
  }

  handleSearchID(e) {
    e.preventDefault();

    const confessRef = database.ref("confess");

    database.ref("confess").orderByChild("shortID").equalTo(this.refs.shortID.value).once("value", (data) => {
      if (data.numChildren() === 0) {
        this.setState({
          searchErr: true
        });
      } else {
        this.setState({
          searchDone: true,
          searchErr: false,
          searchObj: data.val()[Object.keys(data.val())[0]]
        });
      }
    }, (err) => {
      console.log(err);
    });
  }

  render() {
    const { isLoginMode } = this.state;
    const { searchDone, searchObj, searchErr } = this.state;

    if (isLoginMode) {
      return (
        <div>
          <div className="container">
            <h1 className="header center blue-text">
              FPTU HCM Confessions Insight
            </h1>
            <div className="row center">
              <h5 className="header col s12 light">
                Sorry, guest has no access permission. You must be a staff of
                FPTU HCM Confessions.
              </h5>
            </div>
            {/* <div className="row center">
              <button className="btn-large waves-effect waves-light blue" onClick={startGoogleLogin()}><i className="material-icons left">account_circle</i>Login with Google account</button>
            </div> */}
            <div className="row">
              <div className="col s12 m8 offset-m2">
                <div className="card white darken-1">
                  <div className="card-content black-text">
                    <div className="card-title blue-text">
                      Login with email and password
                    </div>
                    <form onSubmit={e => this.handleEmailLogin(e)}>
                      <div className="input-field ">
                        <input id="email" ref="email" type="email" />
                        <label htmlFor="email">Email</label>
                      </div>
                      <div className="input-field ">
                        <input id="password" ref="password" type="password" />
                        <label htmlFor="password">Password</label>
                      </div>
                      <div className="row center">
                        <button
                          className="btn waves-effect waves-light blue"
                          onClick={e => this.handleEmailLogin(e)}
                        >
                          <i className="material-icons left">cloud_done</i>Staff Login
                        </button>
                        &nbsp;
                        {/* <button className="btn waves-effect waves-light pink" onClick={() => this.handleEmailLogin(true)}><i className="material-icons left">cloud_upload</i>Signup</button> */}
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="row">
                <button
                  className="btn waves-effect waves-light green right"
                  onClick={() => this.handleChangeMode()}
                >
                  <i className="material-icons left">chevron_left</i>Back to
                  Send Confession
                </button>
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
              <a
                className="modal-action modal-close waves-effect waves-green btn-flat"
                onClick={e => this.handleCloseModal(e)}
              >
                I know
              </a>
            </div>
          </div>
        </div>
      );
    } else {
      const { isConfessSent } = this.state;

      return (
        <div>
          <div className="container">
            <div className="row center"><img src="https://firebasestorage.googleapis.com/v0/b/boiler-plate-1371f.appspot.com/o/logo.png?alt=media&token=7f391463-6bc1-4812-8cb7-a4bb68c6fbb8" width="50%" /></div>
            <div className="row">
              <div className="col s8 offset-s2 light">
                Something is hard to say but we easily write down what we think. Please don't think too much, just write it out. By the way, we ensure that your secret is obviously safe.<br />
                <ul className="collection">
                  <li className="collection-item">
                    <a className="waves-effect waves-light btn-small red" href="http://gg.gg/ruleCfs" style={{ margin: "5px" }}>Post rules</a>
                    <a className="waves-effect waves-light btn-small blue" href="https://www.fb.com/groups/FPTUCfsCommunity/" style={{ margin: "5px" }}>Group Community Student of FPTU HCM</a>
                    <a className="waves-effect waves-light btn-small orange" href="mailto:fpt.hcm.confess@gmail.com?Subject=Why%20my%confesssion%20not%posted" style={{ margin: "5px" }}>Contact Us</a>
                  </li>
                </ul>
                Your confession will be carefully hold for checking up 2 days. If your post has still not been seen for more than 2 days, please contact us via email or fan page.
              </div>
            </div>
            <div className="row">
              <div className="col s12 m8 offset-m2">
                <div className="card white darken-1">
                  <div
                    className={`card-content black-text ${
                      isConfessSent ? "hide" : null
                      }`}
                  >
                    <div className="card-title blue-text">
                      Make Your Confession
                    </div>
                    <div className="input-field ">
                      <textarea
                        id="message"
                        ref="message"
                        className="materialize-textarea"
                        style={{ height: "200px" }}
                      />
                      <label htmlFor="message">Confess Message</label>
                    </div>
                    <div className="row center">
                      <div className="col s12 m6">
                        <button
                          className="btn waves-effect waves-light green"
                          onClick={() => this.handleSendConfess()}
                          style={{ margin: "5px" }}
                        >
                          <i className="material-icons left">check</i>Be brave,
                          send It!
                        </button>
                      </div>
                      <div className="col s12 m6">
                        <button
                          className="btn waves-effect waves-light orange"
                          onClick={() => this.handleImageUpload()}
                          style={{ margin: "5px" }}
                        >
                          <i className="material-icons left">file_upload</i>Add
                          Image
                        </button>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`card-content black-text ${
                      !isConfessSent ? "hide" : null
                      }`}
                  >
                    <div className="card-title blue-text">
                      Your confess has been sent!
                    </div>
                    <div>
                      Thank you! If your confess is valid, it will be available
                      on fanpage soon!
                    </div>
                    <div>
                      Here is your ID to check if it was posted or rejected by admin for any specific reason: <b>{this.state.shortID}</b>
                    </div>
                    <div>You can use the ID to check by clicking 'ID Check' button below.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row" className={`${this.state.isConfessSearch ? null : "hide" }`}>
              <div className="card-panel yellow">
                <form onSubmit={(e) => this.handleSearchID(e)}>
                  <div className="input-field">
                    <input disabled={this.state.searchDone} id="shortid" ref="shortID" type="text" className="validate" />
                    <label htmlFor="shortid">Enter Confess ID here to get its status</label>
                  </div>
                </form>

                <div
                  className={`${
                    searchErr ? null : "hide"
                    }`}
                >
                 <div>Not a valid ID!!</div>
                </div>

                <div
                  className={`${
                    searchDone ? null : "hide"
                    }`}
                >
                  <div>Confessions sent at {searchObj.time} is {!searchObj && "Loading..."} <b>{searchObj.status === 0 && "pending"}{searchObj.status === 1 && "approved"}{searchObj.status === 2 && "rejected"}</b>.</div>
                  <div>{searchObj.status === 2 && `This confess was rejected for the reason of 'invalid content' by admin: ${searchObj.approver}.`}</div>
                  <div
                  className={`${
                    searchObj.status === 1 ? null : "hide"
                    }`}
                  >
                    <div>The hashtag of the approved confession is <b><a href={`https://www.facebook.com/hashtag/fptuc_${searchObj.id}`} target="_blank">#FPTU_{searchObj.id}</a></b>.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <button className="btn waves-effect waves-light pink right" onClick={() => this.handleOpenSearch()}>
                <i className="material-icons left">search</i>
                Confession ID Check
              </button>
            </div>

            <div className="row">
              <button
                className="btn waves-effect waves-light blue right"
                onClick={() => this.handleChangeMode()}
              >
                <i className="material-icons left">chevron_right</i>Login to
								FPTU HCM Confessions Insight
              </button>
            </div>
          </div>
          <Footer />

          <div id="login" className="modal">
            <div className="modal-content">
              <h4>FUHCM Confess report an error!</h4>
              <p>{this.state.modalMessage}</p>
            </div>
            <div className="modal-footer">
              <a
                className="modal-action modal-close waves-effect waves-green btn-flat"
                onClick={e => this.handleCloseModal(e)}
              >
                I know
              </a>
            </div>
          </div>
        </div>
      );
    }
  }
}

const mapDispatchToProps = dispatch => ({
  startLogin: () => dispatch(startLogin())
});

export default connect(undefined, mapDispatchToProps)(LoginPage);

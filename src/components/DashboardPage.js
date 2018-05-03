import React, { Component } from 'react';
import { firebase, database } from '../firebase/firebase';
import $ from "jquery";

class DashboardPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listConfess: {},
      loadCount: 10,
      confessId: 0,
      modalMessage: "Nothing is here.",
      isLoading: false,
      totalRecords: 0,
      // total posted
      totalUserApproved: 0,
      totalWaiting: 0
    };
  }

  getNumOfPost() {
    database.ref("confess").orderByChild("approver").equalTo(firebase.auth().currentUser.email).on("value", (data) => {
      const totalUserApproved = data.numChildren();
      this.setState({
        totalUserApproved
      });
    }, err => {
      // Error
    });

    database.ref("confess").orderByChild("status").equalTo(0).on("value", (data) => {
      const totalWaiting = data.numChildren();
      this.setState({
        totalWaiting
      });
    }, err => {
      // Error
    });
  }

  setTotalConfess() {
    database.ref("confess").orderByChild("hide").equalTo(false).on("value", (data) => {
      const totalRecords = data.numChildren();
      this.setState({
        totalRecords
      });
    }, err => {
      // Error
    });
  }

  loadConfess(count) {
    database.ref("confess").orderByChild("hide").equalTo(false).limitToLast(count).on("value", (data) => {
      const listConfess = data.val();
      this.setState({
        listConfess: listConfess,
        isLoading: false
      });
    }, err => {
      // Error
    });
  }

  loadConfessId(callback) {
    database.ref("confess").child("confessId").once("value", (data) => {
      const confessId = data.val().value;
      this.setState({
        confessId: confessId
      });
      callback(confessId);
    }, err => {
      // Error
    });
  }

  increaseConfessId() {
    this.loadConfessId((confessId) => {
      database.ref("confess").child("confessId").update({ value: confessId + 1 });
    });
  }

  componentDidMount() {
    this.setTotalConfess();
    this.loadConfess(this.state.loadCount);
    const me = this;

    $(window).scroll(function () {
      if ($(window).scrollTop() + $(window).height() > $(document).height() - 350) {
        if (!me.state.isLoading && me.state.loadCount <= me.state.totalRecords) {
          me.handleLoadMore();
        }
      }
    });

    this.getNumOfPost();
  }

  updateConfess(key, obj) {
    database.ref("confess").child(key).update(obj);
  }

  handleApprove(key, message, time) {

    this.loadConfessId((confessId) => {
      this.updateConfess(key, { approver: firebase.auth().currentUser.email, status: 1, id: confessId });
      this.increaseConfessId();
      M.toast({ html: "Approved!", classes: "rounded" });

      const elem = document.querySelector(".modal");
      const option = {
        opacity: 0.2,
        dismissible: false
      };
      const instance = M.Modal.init(elem, option);
      const adminName = firebase.auth().currentUser.email.replace(/@.*$/, "");

      this.setState({
        modalMessage: `#FPTUC_${confessId} [${time}]<br/>"${message}"<br/>-----------------<br/>${adminName}<br/>#FPTUCfs`
      });
      instance.open();
    });
  }

  handleReject(key) {
    this.updateConfess(key, { approver: firebase.auth().currentUser.email, status: 2 });
    M.toast({ html: "Rejected!", classes: "rounded" });
  }

  // Is not used
  handleHide(key) {
    this.updateConfess(key, { hide: true });
  }

  handleLoadMore() {
    this.setState({
      loadCount: this.state.loadCount + 10,
      isLoading: true
    }, () => {
      this.loadConfess(this.state.loadCount);
    });
  }

  render() {
    const { listConfess } = this.state;

    const keys = Object.keys(listConfess);
    const renderConfess = keys.reverse().map((key, index) => {
      listConfess[key].message = listConfess[key].message.replace(/(?:\r\n|\r|\n)/g, '<br />')
      return (
        <li key={key} className="collection-item avatar">
          {listConfess[key].status === 0 && <i className="material-icons circle green">hourglass_empty</i>}
          {listConfess[key].status === 1 && <i className="material-icons circle blue">check</i>}
          {listConfess[key].status === 2 && <i className="material-icons circle red">clear</i>}
          <p className={`${listConfess[key].status === 2 ? "reject-text" : null}`} style={{ marginBottom: "10px" }} dangerouslySetInnerHTML={{ __html: listConfess[key].message }}></p>
          <p className="right-align"><span className="new badge" data-badge-caption="" style={{ margin: "5px" }}>{listConfess[key].time}</span></p>
          <div className={`chip ${listConfess[key].status === 0 && "hide"}`}>
            {listConfess[key].approver !== "" ? `${listConfess[key].approver}` : null}
            <i className="material-icons" style={{ float: "left", fontSize: "16px", lineHeight: "32px", paddingRight: "8px" }}>account_circle</i>
          </div>
          <div className={`chip ${listConfess[key].id === 0 || listConfess[key].id === undefined ? "hide" : null}`}>
            {listConfess[key].id !== 0 && listConfess[key].id !== undefined ? <a href={`https://www.facebook.com/hashtag/fptuc_${listConfess[key].id}`} target="_blank">#FPTUC_{listConfess[key].id}</a> : null}
          </div>
          <div>{listConfess[key].status === 0 && <button className="waves-effect waves-light btn-small green pulse" onClick={() => this.handleApprove(key, listConfess[key].message, listConfess[key].time)} style={{ margin: "5px" }}><i className="material-icons left">check</i>Approve</button>} {listConfess[key].status === 0 && <button className="waves-effect waves-light btn-small pink" onClick={() => this.handleReject(key)} style={{ margin: "5px" }}><i className="material-icons left">clear</i>Reject</button>}</div>
        </li>
      );
    });

    const renderLoading = () => {
      return (
        <div className="preloader-wrapper big active">
          <div className="spinner-layer spinner-blue">
            <div className="circle-clipper left">
              <div className="circle"></div>
            </div><div className="gap-patch">
              <div className="circle"></div>
            </div><div className="circle-clipper right">
              <div className="circle"></div>
            </div>
          </div>

          <div className="spinner-layer spinner-red">
            <div className="circle-clipper left">
              <div className="circle"></div>
            </div><div className="gap-patch">
              <div className="circle"></div>
            </div><div className="circle-clipper right">
              <div className="circle"></div>
            </div>
          </div>

          <div className="spinner-layer spinner-yellow">
            <div className="circle-clipper left">
              <div className="circle"></div>
            </div><div className="gap-patch">
              <div className="circle"></div>
            </div><div className="circle-clipper right">
              <div className="circle"></div>
            </div>
          </div>

          <div className="spinner-layer spinner-green">
            <div className="circle-clipper left">
              <div className="circle"></div>
            </div><div className="gap-patch">
              <div className="circle"></div>
            </div><div className="circle-clipper right">
              <div className="circle"></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col s12">
              <div className="card blue-grey darken-1" style={{marginTop: "20px"}}>
                <div className="card-content white-text">
                  <span className="card-title"><b class="small material-icons">insert_chart</b> <strong>Developer Note</strong>: Version @1.5 - Updated at May 5 2018</span>
                  <div style={{padding: "10px", marginBottom: "20px", border: "2px solid white"}}>
                    <p><strong>Change Logs for new version: </strong></p>
                    <p>- Fix bugs HTML render for "\n" item, enter character in confessions solved.</p>
                    <p>- Added dashboard statics.</p>
                    <p>- Fix bug automatic load more.</p>
                  </div>
                  <p>Hello <strong>{firebase.auth().currentUser.email.replace(/@.*$/, "")}</strong>, have a nice day!</p>
                  <p>Total confession were sent to system: <strong>{this.state.totalRecords === 0 ? "Loading...": this.state.totalRecords}</strong></p>
                  <p>You approved/rejected <strong>{this.state.totalUserApproved} confessions</strong>, which is <strong>{(this.state.totalRecords !== 0 && this.state.totalUserApproved !== 0) ? ((this.state.totalUserApproved / this.state.totalRecords * 100).toFixed(2)) : "0"}%</strong> of total</p>
                  <p>There is/are <strong>{this.state.totalWaiting}</strong> confession(s) waiting for approval</p>
                </div>
              </div>
            </div>
          </div>

          <ul className="collection">
            {keys.length > 0 ? null : <li className="collection-item center">{renderLoading()}</li>}
            {renderConfess}
          </ul>
          <div className="row center">
            {this.state.isLoading && renderLoading()}
          </div>
        </div>

        <div id="autopost" className="modal">
          <div className="modal-content">
            <h4>Just Copy & Paste on the Page!</h4>
            <p dangerouslySetInnerHTML={{ __html: this.state.modalMessage }}></p>
          </div>
          <div className="modal-footer">
            <a
              className="modal-action modal-close waves-effect waves-green btn-flat"
              onClick={e => this.handleCloseModal(e)}
            >
              I'm done!
              </a>
          </div>
        </div>
      </div>
    );
  }
}

export default DashboardPage;

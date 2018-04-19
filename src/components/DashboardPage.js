import React, { Component } from 'react';
import { firebase, database } from '../firebase/firebase';

class DashboardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listConfess: {},
      loadCount: 10,
      confessId: 0
    };
  }

  loadConfess(count) {
    database.ref("confess").orderByChild("hide").equalTo(false).limitToLast(count).on("value", (data) => {
      const listConfess = data.val();
      this.setState({
        listConfess: listConfess
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
    this.loadConfess(this.state.loadCount);
  }

  updateConfess(key, obj) {
    database.ref("confess").child(key).update(obj);
  }

  handleApprove(key) {
    this.loadConfessId((confessId) => {
      this.updateConfess(key, { approver: firebase.auth().currentUser.email, status: 1, id: confessId });
      this.increaseConfessId();
    });

    M.toast({ html: "Approved!", classes: "rounded" });
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
      loadCount: this.state.loadCount + 10
    }, () => {
      this.loadConfess(this.state.loadCount);
      M.toast({ html: "Loaded successfully", classes: "rounded" });
    });
  }

  render() {
    const { listConfess } = this.state;

    const keys = Object.keys(listConfess);
    const renderConfess = keys.reverse().map((key, index) => {
      return (
        <li key={key} className="collection-item avatar">
          {listConfess[key].status === 0 && <i class="material-icons circle green">hourglass_empty</i>}
          {listConfess[key].status === 1 && <i class="material-icons circle blue">check</i>}
          {listConfess[key].status === 2 && <i class="material-icons circle red">clear</i>}
          <p className={`${listConfess[key].status === 2 ? "reject-text" : null}`} style={{ marginBottom: "10px" }}>
            {listConfess[key].message}
          </p>
          <p className="right-align"><span className="new badge" data-badge-caption="" style={{ margin: "5px" }}>{listConfess[key].time}</span></p>
          <div className={`chip ${listConfess[key].status === 0 && "hide"}`}>
            {listConfess[key].approver !== "" ? `${listConfess[key].approver}` : null}
            <i className="material-icons" style={{float: "left", fontSize: "16px", lineHeight: "32px", paddingRight: "8px"}}>account_circle</i>
          </div>
          <div className={`chip ${listConfess[key].id === 0 || listConfess[key].id === undefined ? "hide" : null}`}>
            {listConfess[key].id !== 0 && listConfess[key].id !== undefined ? `#FPTUC_${listConfess[key].id}` : null}
          </div>
          <div>{listConfess[key].status === 0 && <button className="waves-effect waves-light btn-small green pulse" onClick={() => this.handleApprove(key)} style={{ margin: "5px" }}><i className="material-icons left">check</i>Approve</button>} {listConfess[key].status === 0 && <button className="waves-effect waves-light btn-small pink" onClick={() => this.handleReject(key)} style={{ margin: "5px" }}><i className="material-icons left">clear</i>Reject</button>}</div>
        </li>
      );
    });

    return (
      <div>
        <div className="container">
          <h2 className="header center blue-text">Confessions Management</h2>
          <ul className="collection">
            {keys.length > 0 ? null : <li className="collection-item">Loading...</li>}
            {renderConfess}
          </ul>
          <div className="row center">
            <button className="waves-effect waves-light btn blue" onClick={() => this.handleLoadMore()}><i className="material-icons left">chevron_right</i>Load more...</button>
          </div>
        </div>
      </div>
    );
  }
}

export default DashboardPage;

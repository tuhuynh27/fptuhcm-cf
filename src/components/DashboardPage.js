import React, { Component } from 'react';
import { firebase, database } from '../firebase/firebase';

class DashboardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listConfess: {},
      loadCount: 10
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

  componentDidMount() {
    this.loadConfess(this.state.loadCount);
  }

  updateConfess(key, obj) {
    database.ref("confess").child(key).update(obj);
  }

  handleApprove(key) {
    this.updateConfess(key, { approver: firebase.auth().currentUser.email, status: 1 });
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
        <tr key={key}>
          <td className="center-align">{index + 1}</td>
          <td>
            <p className={`${listConfess[key].status === 2 ? "reject-text" : null}`}>
              {listConfess[key].message}
              </p>
            <p className="right-align"><span className="new badge" data-badge-caption="">{listConfess[key].time}</span></p>
            <div className={`normal-section ${listConfess[key].status === 1 ? "approve-section" : null} ${listConfess[key].status === 2 ? "reject-section" : null}`}>
              {listConfess[key].status === 0 && "Not reviewed yet"}
              {listConfess[key].status === 1 && "Approved"}
              {listConfess[key].status === 2 && "Rejected"}&nbsp;
              {listConfess[key].approver !== "" ? `by ${listConfess[key].approver}` : null}
            </div>
            <div>{listConfess[key].status === 0 && <button className="waves-effect waves-light btn green" onClick={() => this.handleApprove(key)}><i className="material-icons left">check</i>Approve</button>} {listConfess[key].status === 0 && <button className="waves-effect waves-light btn pink" onClick={() => this.handleReject(key)}><i className="material-icons left">block</i>Reject</button>}</div>
          </td>
        </tr>
      );
    });

    return (
      <div>
        <div className="container-fluid">
          <h2 className="header center blue-text">Confessions Manager</h2>
          <div className="row">
            <table className="highlight">
              <thead>
                <tr>
                  <th width="10%" className="center-align">ID</th>
                  <th width="90%">Confess</th>
                </tr>
              </thead>
              <tbody>
                {keys.length > 0 ? null : <tr><td colSpan="2">Loading...</td></tr>}
                {renderConfess}
              </tbody>
            </table>
          </div>
          <div className="row center">
            <button className="waves-effect waves-light btn blue" onClick={() => this.handleLoadMore()}><i className="material-icons left">chevron_right</i>Load more...</button>
          </div>
        </div>
      </div>
    );
  }
}

export default DashboardPage;

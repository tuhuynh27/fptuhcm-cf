import React, { Component } from 'react';
import { firebase, database } from '../firebase/firebase';

class DashboardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listConfess: {}
    };
  }

  componentDidMount() {
    const elem = document.querySelector('.parallax');
    const instance = M.Parallax.init(elem);

    database.ref("confess").orderByChild("hide").equalTo(false).on("value", (data) => {
      const listConfess = data.val();
      this.setState({
        listConfess: listConfess
      });
    }, err => {
      // Error
    });
  }

  updateConfess(key, obj) {
    database.ref("confess").child(key).update(obj);
  }

  handleApprove(key) {
    this.updateConfess(key, { approver: firebase.auth().currentUser.email, status: 1 });
  }

  handleReject(key) {
    this.updateConfess(key, { approver: firebase.auth().currentUser.email, status: 2 });
  }

  handleHide(key) {
    this.updateConfess(key, { hide: true });
  }

  render() {
    const { listConfess } = this.state;

    const keys = Object.keys(listConfess);
    const renderConfess = keys.reverse().map((key, index) => {
      return (
        <tr key={key}>
          <td className="center-align">{index + 1}</td>
          <td>
            <p><strong>Send to</strong>: {listConfess[key].sendto}</p><p>{listConfess[key].message}</p>
            <p><strong>Time</strong>: {listConfess[key].time}</p>
            <p><strong>Status</strong>:&nbsp;
                {listConfess[key].status === 0 && "Not reviewed yet"}
              {listConfess[key].status === 1 && "Approved"}
              {listConfess[key].status === 2 && "Rejected"}&nbsp;
                {listConfess[key].approver !== "" ? `by ${listConfess[key].approver}` : null}
            </p>
            <p>{listConfess[key].status === 0 && <button className="waves-effect waves-light btn green" onClick={() => this.handleApprove(key)}><i className="material-icons left">check</i>Approve</button>} {listConfess[key].status === 0 && <button className="waves-effect waves-light btn pink" onClick={() => this.handleReject(key)}><i className="material-icons left">block</i>Reject</button>} {listConfess[key].status !== 0 && <button className="waves-effect waves-light btn" onClick={() => this.handleHide(key)}><i className="material-icons left">remove</i>Hide</button>}</p>
          </td>
        </tr>
      );
    });

    return (
      <div>
        <div className="parallax-container valign-wrapper" style={{ height: "400px" }}>
          <div className="row center">
          </div>
          <div className="parallax"><img src="https://i.imgur.com/6OiVyuZ.jpg" alt="" /></div>
        </div>

        <div className="container-fluid">
          <h1 className="header center blue-text">Admin Page</h1>
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
        </div>
      </div>
    );
  }
}

export default DashboardPage;

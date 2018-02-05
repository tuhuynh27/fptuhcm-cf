import React, { Component } from 'react';

import { firebase, database } from '../firebase/firebase';

class ChatPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listChat: {}
    };
  }

  handleEnter(event) {
    if (event.key === "Enter") {
      this.handleSend();
    }
  }

  handleSend() {
    if (this.refs.message.value === "") {
      M.toast({ html: "Please enter something to send!", classes: "rounded" });
      this.refs.message.focus();
    } else {
      const chatRef = database.ref("chat");
      const data = {
        email: firebase.auth().currentUser.email,
        message: this.refs.message.value,
        time: new Date().toLocaleString()
      }

      chatRef.push(data);
      this.refs.message.value = null;
      this.refs.message.focus();
    }
  };

  componentDidMount() {
    database.ref("chat").limitToLast(10).on("value", (data) => {
      const listChat = data.val();
      this.setState({
        listChat: listChat
      });
    }, err => {
      // Error
    });
  }

  render() {
    const user = firebase.auth().currentUser;
    const { listChat } = this.state;

    const keys = Object.keys(listChat);
    const renderChat = keys.map((key) => {
      return (
        <li key={key} className="collection-item truncate"><span className="new badge" data-badge-caption="">{listChat[key].time}</span>{listChat[key].email}: {listChat[key].message}</li>
      );
    });

    return (
      <div className="container">
        <h2>Real-time Chat Board</h2>
        <ul className="collection hoverable">
          {keys.length > 0 ? null : <li className="collection-item">Loading...</li>}
          {renderChat}
        </ul>
        <div className="row">
          <div className="input-field col s12">
            <input type="text" id="message" ref="message" onKeyPress={(event) => this.handleEnter(event)}></input>
            <label htmlFor="message">Enter something and hit "Send!"</label>
          </div>
          <div className="row">
            <button className="btn-large waves-effect waves-light pink" onClick={() => this.handleSend()}><i className="material-icons left">chat_bubble</i>Send via @{user.email}</button>
          </div>
        </div>
      </div>
    );
  }
}

export default ChatPage;

import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { firebase } from '../firebase/firebase';

export const Footer = () => {
    const user = firebase.auth().currentUser;

    return (
        <footer className="page-footer green">
            <div className="container">
                <div className="row">
                    <div className="col l6 s12">
                        <h5 className="white-text"><i className="material-icons left">cloud</i>BlueCloud Inc.</h5>
                        <p className="grey-text text-lighten-4">We are a team of college students working on this project like it's our part time job. Any amount would help support
            and continue development on this project and is greatly appreciated.</p>
                    </div>
                    <div className="col l3 s12">
                        <h5 className="white-text">Settings</h5>
                        <ul>
                            <li>
                                <a className="white-text" href="#!">Link 1</a>
                            </li>
                            <li>
                                <a className="white-text" href="#!">Link 2</a>
                            </li>
                            <li>
                                <a className="white-text" href="#!">Link 3</a>
                            </li>
                            <li>
                                <a className="white-text" href="#!">Link 4</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col l3 s12">
                        <h5 className="white-text">Connect</h5>
                        <ul>
                            <li>
                                <a className="white-text" href="#!">Link 1</a>
                            </li>
                            <li>
                                <a className="white-text" href="#!">Link 2</a>
                            </li>
                            <li>
                                <a className="white-text" href="#!">Link 3</a>
                            </li>
                            <li>
                                <a className="white-text" href="#!">Link 4</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="footer-copyright">
                <div className="container">
                    &copy; 2018 Created by <a className="white-text text-lighten-3" href="http://mrhmt.com" target="_blank">Huynh Minh Tu</a>
                </div>
            </div>
        </footer>
    );
}

const mapDispatchToProps = (dispatch) => ({
});

export default connect(undefined, mapDispatchToProps)(Footer);

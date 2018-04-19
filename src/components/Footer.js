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
                        <h5 className="white-text"><i className="material-icons left">code</i>FU Confession Developer Team.</h5>
                        <p className="grey-text text-lighten-4">We are a team of college students working on this project like it's our part time job. Any amount would help support
            and continue development on this project and is greatly appreciated. </p>
                    </div>
                    <div className="col l3 s12">
                        <h5 className="white-text">FPT Refs</h5>
                        <ul>
                            <li>
                                <a className="white-text" href="http://lms-undergrad.fpt.edu.vn/" target="_blank">LMS</a>
                            </li>
                            <li>
                                <a className="white-text" href="http://fap.fpt.edu.vn/" target="_blank">FAP</a>
                            </li>
                            <li>
                                <a className="white-text" href="http://daihoc.fpt.edu.vn/" target="_blank">FPT Universitys Home</a>
                            </li>
                            <li>
                                <a className="white-text" href="https://www.facebook.com/FuHcmConfess/" target="_blank">FPTU HCM Confessions</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col l3 s12">
                        <h5 className="white-text">Connect</h5>
                        <ul>
                            <li>
                                <a className="white-text" href="https://www.facebook.com/1001SuThatDHFPT/" target="_blank">1001 Truths about FU</a>
                            </li>
                            <li>
                                <a className="white-text" href="https://www.facebook.com/FPTUHCMConfessions/message" target="_blank">FPTU HCM Confessions Chatbot</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="footer-copyright">
                <div className="container">
                    &copy; 2018 Made with love in <a className="white-text text-lighten-3" href="http://fpt.edu.vn" target="_blank">FPT University</a>. <a href="https://www.messenger.com/t/mr.huynhminhtu" target="_blank"><button className="btn-small pink waves-effect waves-light right pulse" style={{margin: "5px"}}><i className="material-icons left">bug_report</i> Report bug</button></a>
                </div>
            </div>
        </footer>
    );
}

const mapDispatchToProps = (dispatch) => ({
});

export default connect(undefined, mapDispatchToProps)(Footer);

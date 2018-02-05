import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="container">
    <h1 className="header center blue-text">404 Not Found!</h1>
    <div className="row center">
      <button className="btn-large waves-effect waves-light blue">Go Home</button>
    </div>
  </div>
);

export default NotFoundPage;

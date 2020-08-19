import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { renderRoutes } from "react-router-config";
import './index.scss';
import routes from './router/routes';
import * as serviceWorker from './serviceWorker';


ReactDOM.render(
  <Router>
    {renderRoutes(routes)}
  </Router>, 
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

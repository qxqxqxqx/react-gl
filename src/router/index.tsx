/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-07-30 13:52:58
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-07 17:05:12
 * @Description: 路由入口
 */ 
import React, { ReactElement } from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import App from '../views/app/App';
import Home from "../views/home";

export default function BaseRouter(): ReactElement{
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <App />
        </Route>
        <Route path="/home/:type?">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}
/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-07-30 13:52:58
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-07-30 14:10:27
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
        <Route exact path="/home">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}
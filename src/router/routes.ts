/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-19 13:48:04
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-09-30 11:58:54
 * @Description: 路由配置文件
 */
import App from '../views/app/App';
import Home from '../views/home';

import NativeRoute from './native';

const appRoute = {
  component: App,
  path: '/',
  exact: true
};


const homeRoute = {
  component: Home,
  path: '/home',
  routes: [NativeRoute],
};

export default [appRoute, homeRoute];

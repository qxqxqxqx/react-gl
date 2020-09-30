/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-19 13:48:04
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-09-30 15:01:28
 * @Description: 路由配置文件
 */
import App from '../views/app/App';
import Home from '../views/home';

import NativeRoute from './native';
import ThreeFiberRoute from './threeFiber';

const appRoute = {
  component: App,
  path: '/',
  exact: true
};


const homeRoute = {
  component: Home,
  path: '/home',
  routes: [NativeRoute, ThreeFiberRoute],
};

export default [appRoute, homeRoute];

/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-19 14:31:35
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-19 17:21:30
 * @Description: 粒子与精灵
 */
import React, { ReactElement } from 'react';
import { renderRoutes } from "react-router-config";

export default function Spirite(props: any): ReactElement {

  return <>{renderRoutes(props.route.routes)}</>

}
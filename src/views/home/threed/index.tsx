/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-19 14:13:40
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-19 17:21:12
 * @Description: 三维模型
 */
import React, { ReactElement } from 'react';
import { renderRoutes } from "react-router-config";

export default function Threed(props: any): ReactElement {

  return <>{renderRoutes(props.route.routes)}</>

}
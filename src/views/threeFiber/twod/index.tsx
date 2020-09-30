/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-19 14:07:23
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-09-30 14:59:52
 * @Description: t3f 二维组件
 */
import React, { ReactElement } from 'react';
import { renderRoutes } from "react-router-config";

export default function Twod(props: any): ReactElement {

  return <>{renderRoutes(props.route.routes)}</>

}
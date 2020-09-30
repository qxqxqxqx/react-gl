/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-09-30 11:43:25
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-09-30 11:44:08
 * @Description: 基于原生组件
 */
import React, { ReactElement } from 'react';
import { renderRoutes } from "react-router-config";

export default function Native(props: any): ReactElement {

  return <>{renderRoutes(props.route.routes)}</>

}
/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-19 14:24:08
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-19 17:21:39
 * @Description: 高级几何体
 */
import React, { ReactElement } from 'react';
import { renderRoutes } from "react-router-config";

export default function Advanced(props: any): ReactElement {

  return <>{renderRoutes(props.route.routes)}</>

}
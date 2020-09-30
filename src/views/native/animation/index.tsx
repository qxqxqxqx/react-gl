/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-26 14:54:44
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-26 14:55:25
 * @Description: 创建动画和移动摄像机
 */
import React, { ReactElement } from 'react';
import { renderRoutes } from "react-router-config";

export default function Animation(props: any): ReactElement {

  return <>{renderRoutes(props.route.routes)}</>

}
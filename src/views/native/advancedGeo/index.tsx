/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-19 15:18:10
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-19 17:21:51
 * @Description: 创建加载高级网格和几何体
 */
import React, { ReactElement } from 'react';
import { renderRoutes } from "react-router-config";

export default function AdvancedGeo(props: any): ReactElement {

  return <>{renderRoutes(props.route.routes)}</>

}
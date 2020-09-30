/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-09-30 14:49:18
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-09-30 15:02:24
 * @Description: using react-three-fiber
 */
import React, { ReactElement } from 'react';
import { renderRoutes } from 'react-router-config';

export default function ThreeFiber(props: any): ReactElement {

  return <>{renderRoutes(props.route.routes)}</>;
  
}

/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-09-30 14:51:16
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-09-30 15:23:26
 * @Description: r3f plangeometry
 */
import React, { ReactElement } from "react";
import { Canvas } from 'react-three-fiber';

export default function PlanGeometry(props: any): ReactElement {

  return (
    <Canvas>
      <pointLight position={[10, 10, 10]} />
      <mesh>
        <planeGeometry >
          </planeGeometry>
        <sphereBufferGeometry />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </Canvas>
  )
  
}
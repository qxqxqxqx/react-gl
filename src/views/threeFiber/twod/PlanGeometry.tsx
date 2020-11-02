/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-09-30 14:51:16
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-10-27 18:31:21
 * @Description: r3f plangeometry
 */
import React, { ReactElement } from "react";
import * as THREE from 'three';
import { Canvas } from 'react-three-fiber';

export default function PlanGeometry(props: any): ReactElement {

  return (
    <Canvas>
      <pointLight position={[10, 10, 10]} />
      <mesh>
        <sphereBufferGeometry />
        <meshStandardMaterial color="hotpink" />
      </mesh>
      <mesh receiveShadow>
        <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
        <meshPhongMaterial attach="material" color="0xffffff" />
      </mesh>
    </Canvas>
  )

}
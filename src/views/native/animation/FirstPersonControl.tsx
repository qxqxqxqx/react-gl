/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-31 15:43:38
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-31 16:54:04
 * @Description: 第一视角控制器
 */
import React, { useRef, useEffect, ReactElement } from "react";
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import chroma from 'chroma-js';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';
import { initCamera, initRenderer, initDefaultLighting } from '../../../util/util.js';
import { setRandomColors } from '../../../util/animationUtil';

export default function FirstPersonControl(props: any): ReactElement {

  const wrapRef = useRef(null);
  useEffect(() => {
    let animationId: number | null = null;
    if (wrapRef.current) {
      const wrap: any = wrapRef.current;
      // init renderer
      const renderer = initRenderer(wrap, undefined);
      // init camera
      const camera = initCamera(wrap, undefined);

      const scene = new THREE.Scene();
      const clock = new THREE.Clock();

      initDefaultLighting(scene);

      const fpControls = new FirstPersonControls(camera, renderer.domElement);
      fpControls.lookSpeed = 0.4;
      fpControls.movementSpeed = 20;
      fpControls.lookVertical = true;
      fpControls.constrainVertical = true;
      fpControls.verticalMin = 1.0;
      fpControls.verticalMax = 2.0;
      // fpControls.lon = -150;
      // fpControls.lat = 120;

      const loader = new OBJLoader();

      loader.load(`${process.env.PUBLIC_URL}/models/city/city.obj`, function (object) {

        const scale = chroma.scale(['red', 'green', 'blue']);
        setRandomColors(object, scale);
        const mesh = object;
        scene.add(mesh);

      },
        undefined,
        (e) => {
          console.log(e)
        }
      );

      const render = () => {
        fpControls.update(clock.getDelta());
        requestAnimationFrame(render);
        renderer.render(scene, camera)
      }
      render();

    }
    return () => {
      animationId && cancelAnimationFrame(animationId);
    }
  }, []);

  return <div ref={wrapRef} className="gl-wrapper"></div>;

}


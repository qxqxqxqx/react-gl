/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-31 15:26:41
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-31 15:49:14
 * @Description: 飞行控制器
 */
import React, { useRef, useEffect, ReactElement } from "react";
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import chroma from 'chroma-js';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import { initCamera, initRenderer, initDefaultLighting } from '../../../util/util.js';
import setRandomColors from '../../../util/setRandomColors';

export default function FlyControl(props: any): ReactElement {

  const wrapRef = useRef(null);
  useEffect(() => {
    let animationId: number | null = null;
    if (wrapRef.current) {
      const wrap:any = wrapRef.current;
      // init renderer
      const renderer = initRenderer(wrap, undefined);
      // init camera
      const camera = initCamera(wrap, undefined);

      const scene = new THREE.Scene();
      const clock = new THREE.Clock();

      initDefaultLighting(scene);

      const flyControls = new FlyControls(camera, renderer.domElement);
      flyControls.movementSpeed = 25;
      console.log(wrap)
      flyControls.domElement = renderer.domElement;
      flyControls.rollSpeed = Math.PI / 24;
      flyControls.autoForward = true;
      flyControls.dragToLook = false;

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
        flyControls.update(clock.getDelta());
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


/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-07 17:08:50
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-07 17:13:04
 * @Description: points
 */
import React, { useRef, useEffect, ReactElement } from "react";
import * as THREE from 'three';
import {
  initRenderer,
  initCamera,
  initTrackballControls
} from '../../../util/util.js';

export default function Points(props: any): ReactElement {

  const wrapRef = useRef(null);
  useEffect(() => {
    if (wrapRef.current) {
      const wrap = wrapRef.current;
      // init renderer
      const renderer = initRenderer(wrap, undefined);
      // init camera
      const camera = initCamera(wrap, undefined);
      // init scene
      const scene = new THREE.Scene();
      // position and point the camera to the center of the scene
      camera.position.x = 0;
      camera.position.y = 0;
      camera.position.z = 200;
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      // init trackballControls
      const trackballControls = initTrackballControls(camera, renderer);

      const geom = new THREE.Geometry();
      const material = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        color: 0xffffff
      });

      for (let x = -15; x < 15; x++) {
        for (let y = -10; y < 10; y++) {
          const particle = new THREE.Vector3(x * 4, y * 4, 0);
          geom.vertices.push(particle);
          geom.colors.push(new THREE.Color(Math.random() * 0xffffff));
        }
      }

      const cloud = new THREE.Points(geom, material);
      scene.add(cloud);

      const render = (): void => {
        // stats.update();
        trackballControls.update();
        requestAnimationFrame(render);
        renderer.render(scene, camera);
      }
      render();
    }
  }, []);

  return <div ref={wrapRef} className="gl-wrapper"></div>;

}

/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-07 10:32:36
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-21 17:29:04
 * @Description: 粒子
 */
import React, { useRef, useEffect, ReactElement } from "react";
import * as THREE from 'three';
import { 
  initRenderer, 
  initCamera,
  initTrackballControls
} from '../../../util/util.js';

export default function Spirit(props: any):ReactElement {

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
      for (let x = -15; x < 15; x++) {
        for (let y = -15; y < 15; y++) {
          let material = new THREE.SpriteMaterial({
            color: Math.random() * 0xffffff
          });
          let sprite = new THREE.Sprite(material);
          sprite.position.set(x * 4, y * 4, 0);
          scene.add(sprite);
        }
      }
      const render = ():void => {
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
/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-18 19:50:20
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-21 18:25:54
 * @Description: ColladaLoader
 */
import React, { useRef, useEffect, ReactElement } from "react";
import * as THREE from 'three';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
import BaseLoaderScene from './baseLoaderScene';
import { initCamera } from '../../../util/util.js';

export default function ColladaLoad(props: any): ReactElement {

  const wrapRef = useRef(null);
  useEffect(() => {
    if (wrapRef.current) {
      const wrap = wrapRef.current;
      // init camera
      const camera = initCamera(wrap, new THREE.Vector3(-30, 60, 100));
      camera.lookAt(new THREE.Vector3(0, 45, 0));
      const loaderScene = new BaseLoaderScene(wrap, camera, undefined, undefined, undefined);
      const loader = new ColladaLoader();
      loader.load(`${process.env.PUBLIC_URL}/models/medieval/Medieval_building.DAE`, function (result) {

        const sceneGroup = result.scene;
        sceneGroup.children.forEach(function (child) {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            child.castShadow = true;
          } else {
            // remove any lighting sources from the model
            sceneGroup.remove(child);
          }
        });

        // correctly scale and position the model
        sceneGroup.rotation.z = 0.5 * Math.PI;
        sceneGroup.scale.set(8, 8, 8);

        // call the default render loop.
        loaderScene.render(sceneGroup, camera);
      });
    }
    return () => { }
  }, []);

  return <div ref={wrapRef} className="gl-wrapper"></div>;

}

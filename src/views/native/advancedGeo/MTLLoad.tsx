/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-18 16:02:39
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-18 19:46:22
 * @Description: objloader mtlloader加载模型并直接赋予材质
 */
import React, { useRef, useEffect, ReactElement } from "react";
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
// import BaseLoaderScene from './baseLoaderScene';
import { initCamera, initRenderer } from '../../../util/util.js';

export default function MTLLoad(props: any): ReactElement {

  const wrapRef = useRef(null);
  useEffect(() => {
    if (wrapRef.current) {
      const wrap = wrapRef.current;
      // init camera
      const camera = initCamera(wrap, new THREE.Vector3(-30, 40, 50));
      camera.lookAt(new THREE.Vector3(0, 10, 0));
      // const loaderScene = new BaseLoaderScene(wrap, camera, undefined, undefined, undefined);
      const renderer: any = initRenderer(wrap, undefined);
      const scene = new THREE.Scene();
      const hemiLight = new THREE.AmbientLight('#fff');
      scene.add(hemiLight)
      const render = ():void => {
        renderer.render(scene, camera);
        requestAnimationFrame(render);
      }
      const mtlLoader = new MTLLoader();
      mtlLoader.setPath(process.env.PUBLIC_URL)
      // mtlLoader.setMaterialOptions({ invertTrProperty: true })
      mtlLoader.load('/models/butterfly/butterfly.mtl', function (materials) {
        materials.preload();
        const objLoader = new OBJLoader();
        objLoader.setPath(process.env.PUBLIC_URL)
        objLoader.setMaterials(materials);
        objLoader.load(`${process.env.PUBLIC_URL}/models/butterfly/butterfly.obj`, function (object) {
          // move wings to more horizontal position
          [0, 2, 4, 6].forEach(function (i) {
            object.children[i].rotation.z = 0.3 * Math.PI;
          });
          [1, 3, 5, 7].forEach(function (i) {
            object.children[i].rotation.z = -0.3 * Math.PI;
          });
          // configure the wings,
          const wing2: any = object.children[5];
          const wing1: any = object.children[4];
          wing1.material.opacity = 0.9;
          wing1.material.transparent = true;
          wing1.material.depthTest = false;
          wing1.material.side = THREE.DoubleSide;
          wing2.material.opacity = 0.9;
          wing2.material.depthTest = false;
          wing2.material.transparent = true;
          wing2.material.side = THREE.DoubleSide;
          object.scale.set(140, 140, 140);
          object.rotation.x = 0.2;
          object.rotation.y = -1.3;
          scene.add(object);
          render();
        });
      });

    }
    return () => { }
  }, []);

  return <div ref={wrapRef} className="gl-wrapper"></div>;

}

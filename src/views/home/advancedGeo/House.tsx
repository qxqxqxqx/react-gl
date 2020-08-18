/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-15 16:06:44
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-18 10:19:22
 * @Description: 加载gltf文件
 */
import React, { useRef, useEffect, ReactElement } from "react";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoughnessMipmapper } from 'three/examples/jsm/utils/RoughnessMipmapper.js';
import {
  initCamera,
  initRenderer,
  initDefaultLighting
} from '../../../util/util.js';

export default function House(props: any): ReactElement {

  const wrapRef = useRef(null);
  useEffect(() => {
    if (wrapRef.current) {
      const wrap = wrapRef.current;
      const renderer = initRenderer(wrap, undefined);
      // init camera
      const camera = initCamera(wrap, new THREE.Vector3(50, 50, 50));
      camera.lookAt(new THREE.Vector3(0, 15, 0));
      // init scene
      const scene = new THREE.Scene();
      initDefaultLighting(scene)
      const axes = new THREE.AxesHelper(80);
      scene.add(axes);
      const roughnessMipmapper = new RoughnessMipmapper(renderer);
      const loader = new GLTFLoader().setPath( '/' );
      loader.load('hjmediastudios_house_dist.gltf', function (gltf) {
      
        gltf.scene.traverse(function (child:any) {
          if (child.isMesh) {
            // child.castShadow = true;
          }
        });
        scene.add(gltf.scene);
        roughnessMipmapper.dispose();
        // call the default render loop.
        renderer.render(scene, camera); 
      },
      undefined,
      (e) => {
        console.log(e)
      }
      
      );
      
    }
    return () => {}
  }, []);

  return <div ref={wrapRef} className="gl-wrapper"></div>;

}

/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-18 14:56:25
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-18 16:07:20
 * @Description: objloader
 */
import React, { useRef, useEffect, ReactElement } from "react";
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import BaseLoaderScene from './baseLoaderScene';
import { initCamera } from '../../../util/util.js';

export default function OBJLoad(props: any): ReactElement {

  const wrapRef = useRef(null);
  useEffect(() => {
    if (wrapRef.current) {
      const wrap = wrapRef.current;
      // init camera
      const camera = initCamera(wrap, new THREE.Vector3(50, 50, 50));
      camera.lookAt(new THREE.Vector3(0, 15, 0));
      const loaderScene = new BaseLoaderScene(wrap, camera, undefined, undefined, undefined);
      const loader = new OBJLoader();
      loader.load(`${process.env.PUBLIC_URL}/models/pinecone/pinecone.obj`, function (mesh) {

        const material = new THREE.MeshLambertMaterial({
          color: 0x5C3A21
        });

        // loadedMesh is a group of meshes. For 
        // each mesh set the material, and compute the information 
        // three.js needs for rendering.
        mesh.children.forEach(function (child: any) {
          child.material = material;
          child.geometry.computeVertexNormals();
          child.geometry.computeFaceNormals();
        });

        mesh.scale.set(120, 120, 120)

        // call the default render loop.
        loaderScene.render(mesh, camera);
      },
        undefined,
        (e) => {
          console.log(e)
        }
      );

    }
    return () => { }
  }, []);

  return <div ref={wrapRef} className="gl-wrapper"></div>;

}

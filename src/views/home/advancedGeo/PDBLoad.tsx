/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-18 20:04:07
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-18 20:20:10
 * @Description: PDBLoader
 */
import React, { useRef, useEffect, ReactElement } from "react";
import * as THREE from 'three';
import { PDBLoader } from 'three/examples/jsm/loaders/PDBLoader';
import BaseLoaderScene from '../../../util/baseLoaderScene';
import { initCamera } from '../../../util/util.js';

export default function PDBLoad(props: any): ReactElement {

  const wrapRef = useRef(null);
  useEffect(() => {
    if (wrapRef.current) {
      const wrap = wrapRef.current;
      // init camera
      const camera = initCamera(wrap, new THREE.Vector3(30, 30, 30));
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      const loaderScene = new BaseLoaderScene(wrap, camera, undefined, undefined, undefined);
      const loader = new PDBLoader();
      loader.load(`${process.env.PUBLIC_URL}/models/molecules/diamond.pdb`, function (geometries) {

        const group = new THREE.Object3D();

        // create the atoms
        const geometryAtoms = geometries.geometryAtoms;

        for (let i = 0; i < geometryAtoms.attributes.position.count; i++) {
          const startPosition = new THREE.Vector3();
          startPosition.x = geometryAtoms.attributes.position.getX(i);
          startPosition.y = geometryAtoms.attributes.position.getY(i);
          startPosition.z = geometryAtoms.attributes.position.getZ(i);

          const color = new THREE.Color();
          color.r = geometryAtoms.attributes.color.getX(i);
          color.g = geometryAtoms.attributes.color.getY(i);
          color.b = geometryAtoms.attributes.color.getZ(i);

          const material = new THREE.MeshPhongMaterial({
            color: color
          });

          const sphere = new THREE.SphereGeometry(0.2);
          const mesh = new THREE.Mesh(sphere, material);
          mesh.position.copy(startPosition);
          group.add(mesh);
        }

        // create the bindings
        const geometryBonds = geometries.geometryBonds;

        for (let j = 0; j < geometryBonds.attributes.position.count; j += 2) {
          const startPosition = new THREE.Vector3();
          startPosition.x = geometryBonds.attributes.position.getX(j);
          startPosition.y = geometryBonds.attributes.position.getY(j);
          startPosition.z = geometryBonds.attributes.position.getZ(j);

          const endPosition = new THREE.Vector3();
          endPosition.x = geometryBonds.attributes.position.getX(j + 1);
          endPosition.y = geometryBonds.attributes.position.getY(j + 1);
          endPosition.z = geometryBonds.attributes.position.getZ(j + 1);

          // use the start and end to create a curve, and use the curve to draw
          // a tube, which connects the atoms
          const path = new THREE.CatmullRomCurve3([startPosition, endPosition]);
          const tube = new THREE.TubeGeometry(path, 1, 0.04);
          const material = new THREE.MeshPhongMaterial({
            color: 0xcccccc
          });
          const mesh = new THREE.Mesh(tube, material);
          group.add(mesh);
        }

        loaderScene.render(group, camera);
      });
    }
    return () => { }
  }, []);

  return <div ref={wrapRef} className="gl-wrapper"></div>;

}

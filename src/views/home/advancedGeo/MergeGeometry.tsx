/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-14 17:42:12
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-14 17:53:56
 * @Description: merge
 */
import React, { useRef, useEffect, ReactElement } from "react";
import * as THREE from 'three';
import * as dat from 'dat.gui';
import {
  initRenderer,
  initCamera,
} from '../../../util/util.js';

export default function MergeGeometry(props: any): ReactElement {

  const wrapRef = useRef(null);
  useEffect(() => {
    const gui = new dat.GUI();
    if (wrapRef.current) {
      const wrap = wrapRef.current;
      // init renderer
      const renderer = initRenderer(wrap, undefined);
      // init camera
      const camera = initCamera(wrap, new THREE.Vector3(0, 40, 50));
      // init scene
      const scene = new THREE.Scene();
      camera.lookAt(scene.position);

      const cubeMaterial = new THREE.MeshNormalMaterial({
        transparent: true,
        opacity: 0.5
      });

      const addcube = (): THREE.Mesh => {

        const cubeSize = 1.0;
        const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;
        // position the cube randomly in the scene
        cube.position.x = -60 + Math.round((Math.random() * 100));
        cube.position.y = Math.round((Math.random() * 10));
        cube.position.z = -150 + Math.round((Math.random() * 175));

        // add the cube to the scene
        return cube;
      }
      
      interface Controls {
        // members of your "class" go here
        cameraNear: number,
        cameraFar: number,
        rotationSpeed: number,
        combined: boolean,
        numberOfObjects: number,
        redraw: () => void,
        addCube: () => THREE.Mesh,
        outputObjects: () => void
      }

      const Controls = function (this: Controls) {

        // the start geometry and material. Used as the base for the settings in the control UI
        this.cameraNear = camera.near;
        this.cameraFar = camera.far;
        this.rotationSpeed = 0.02;
        this.combined = false;
        this.numberOfObjects = 500;

        this.redraw = function () {
          const toRemove: THREE.Mesh[] = [];
          scene.traverse(function (e) {
            if (e instanceof THREE.Mesh) toRemove.push(e);
          });
          toRemove.forEach(function (e) {
            scene.remove(e)
          });

          // add a large number of cubes
          if (controls.combined) {
            const geometry = new THREE.Geometry();
            for (let i = 0; i < controls.numberOfObjects; i++) {
              const cubeMesh:any = addcube();
              cubeMesh.updateMatrix();
              geometry.merge(cubeMesh.geometry, cubeMesh.matrix);
            }
            scene.add(new THREE.Mesh(geometry, cubeMaterial));

          } else {
            for (let i = 0; i < controls.numberOfObjects; i++) {
              scene.add(controls.addCube());
            }
          }
        };


        this.addCube = addcube;

        this.outputObjects = function () {
          console.log(scene.children);
        }
      } as any as { new(): Controls; };;
      const controls = new Controls();
      gui.add(controls, 'numberOfObjects', 0, 20000);
      gui.add(controls, 'combined').onChange(controls.redraw);
      gui.add(controls, 'redraw');
     
      controls.redraw();

      let rotation = 0;
      const render = (): void => {
        rotation += 0.005;
        camera.position.x = Math.sin(rotation) * 50;
        // camera.position.y = Math.sin(rotation) * 40;
        camera.position.z = Math.cos(rotation) * 50;
        camera.lookAt(scene.position);

        // render using requestAnimationFrame
        requestAnimationFrame(render);
        renderer.render(scene, camera);
      }
      render();
    }
    return () => {
      gui.destroy()
    }
  }, []);

  return <div ref={wrapRef} className="gl-wrapper"></div>;

}

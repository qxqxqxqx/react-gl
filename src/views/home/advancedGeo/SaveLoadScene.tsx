/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-15 10:49:59
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-21 18:22:22
 * @Description: save load scene
 */
import React, { useRef, useEffect, ReactElement } from "react";
import * as THREE from 'three';
import * as dat from 'dat.gui';
import {
  initRenderer,
  initCamera,
} from '../../../util/util.js';

export default function SaveLoadScene(props: any): ReactElement {

  const wrapRef = useRef(null);
  useEffect(() => {
    const gui = new dat.GUI();
    let animationId: number | null = null;
    if (wrapRef.current) {
      const wrap = wrapRef.current;
      // init renderer
      const renderer = initRenderer(wrap, undefined);
      // init camera
      const camera = initCamera(wrap, new THREE.Vector3(20, 40, 110));
      // init scene
      let scene = new THREE.Scene();
      camera.lookAt(new THREE.Vector3(20, 30, 0));

      // create the ground plane
      const planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
      const planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff
      });
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      //  plane.receiveShadow  = true;

      // rotate and position the plane
      plane.rotation.x = -0.5 * Math.PI;
      plane.position.x = 15;
      plane.position.y = 0;
      plane.position.z = 0;

      // add the plane to the scene
      scene.add(plane);

      // create a cube
      const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
      const cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0xff0000
      });
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      // cube.castShadow = true;

      // position the cube
      cube.position.x = -4;
      cube.position.y = 3;
      cube.position.z = 0;

      // add the cube to the scene
      scene.add(cube);

      const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
      const sphereMaterial = new THREE.MeshLambertMaterial({
        color: 0x7777ff
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

      // position the sphere
      sphere.position.x = 20;
      sphere.position.y = 0;
      sphere.position.z = 2;
      //  sphere.castShadow=true;

      // add the sphere to the scene
      scene.add(sphere);

      // position and point the camera to the center of the scene
      camera.position.x = -30;
      camera.position.y = 40;
      camera.position.z = 30;
      camera.lookAt(scene.position);

      // add subtle ambient lighting
      const ambientLight = new THREE.AmbientLight(0x0c0c0c);
      scene.add(ambientLight);

      // add spotlight for the shadows
      const spotLight = new THREE.PointLight(0xffffff);
      spotLight.position.set(-40, 60, -10);
      //  spotLight.castShadow = true;
      scene.add(spotLight);

      interface Controls {
        exportScene: () => void,
        clearScene: () => void,
        importScene: () => void
      }

      const Controls = function (this: Controls) {

        this.exportScene = function () {
          localStorage.setItem('scene', JSON.stringify(scene.toJSON()));
          console.log(localStorage.getItem("scene"));
        };

        this.clearScene = function () {
          scene = new THREE.Scene();
        };

        this.importScene = function () {
          const json = (localStorage.getItem('scene'));

          if (json) {
            const loadedSceneAsJson = JSON.parse(json);
            const loader = new THREE.ObjectLoader();
            scene = loader.parse(loadedSceneAsJson);
          }
        }
      } as any as { new(): Controls; };;
      const controls = new Controls();
      gui.add(controls, "exportScene");
      gui.add(controls, "clearScene");
      gui.add(controls, "importScene");


      const render = (): void => {
        // render using requestAnimationFrame
        animationId = requestAnimationFrame(render);
        renderer.render(scene, camera);
      }
      render();
    }
    return () => {
      gui.destroy();
      animationId && cancelAnimationFrame(animationId);
    }
  }, []);

  return <div ref={wrapRef} className="gl-wrapper"></div>;

}

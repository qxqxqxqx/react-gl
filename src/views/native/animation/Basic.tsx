/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-26 14:56:37
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-26 15:22:28
 * @Description: 基础动画
 */
import React, { useRef, useEffect, ReactElement } from "react";
import * as THREE from 'three';
import * as dat from 'dat.gui';
import {
  initCamera,
  initRenderer,
  initDefaultLighting,
  addGroundPlane,
  initTrackballControls
} from '../../../util/util.js';

export default function Basic(params: any): ReactElement {
  const wrapRef = useRef(null);
  useEffect(() => {
    const gui = new dat.GUI();
    let animationId: number | null = null;
    const wrap = wrapRef.current;
    // init renderer
    const renderer = initRenderer(wrap, undefined);
    // init camera
    const camera = initCamera(wrap, new THREE.Vector3(-30, 40, 30));
    // init scene
    const scene = new THREE.Scene();
    camera.lookAt(scene.position);
    initDefaultLighting(scene);

    // add groundPlane
    const groundPlane = addGroundPlane(scene)
    groundPlane.position.y = 0;

    // init trackballControls
    const trackballControls = initTrackballControls(camera, renderer);

    // create a cube
    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;

    // position the cube
    cube.position.x = -10;
    cube.position.y = 4;
    cube.position.z = 0;

    // add the cube to the scene
    scene.add(cube);

    const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x7777ff });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // position the sphere
    sphere.position.x = 20;
    sphere.position.y = 0;
    sphere.position.z = 2;
    sphere.castShadow = true;
    // add the sphere to the scene
    scene.add(sphere);

    const cylinderGeometry = new THREE.CylinderGeometry(2, 2, 20);
    const cylinderMaterial = new THREE.MeshStandardMaterial({ color: 0x77ff77 });
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.castShadow = true;
    cylinder.position.set(0, 0, 1);

    scene.add(cylinder);

    // add subtle ambient lighting
    const ambienLight = new THREE.AmbientLight(0x353535);
    scene.add(ambienLight);

    interface Controls {
      // members of your "class" go here
      rotationSpeed: number,
      bouncingSpeed: number,
      scalingSpeed: number,
    }
    const Controls = function (this: Controls) {

      // the start geometry and material. Used as the base for the settings in the control UI
      this.rotationSpeed = 0.02;
      this.bouncingSpeed = 0.03;
      this.scalingSpeed = 0.03;
    } as any as { new(): Controls; };;
    const controls = new Controls();

    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, 'bouncingSpeed', 0, 0.5);
    gui.add(controls, 'scalingSpeed', 0, 0.5);

    let step = 0;
    let scalingStep = 0;
    const renderScene = ():void => {

      trackballControls.update();

      cube.rotation.x += controls.rotationSpeed;
      cube.rotation.y += controls.rotationSpeed;
      cube.rotation.z += controls.rotationSpeed;

      // bounce the sphere up and down
      step += controls.bouncingSpeed;
      sphere.position.x = 20 + (10 * (Math.cos(step)));
      sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

      // scale the cylinder
      scalingStep += controls.scalingSpeed;
      const scaleX = Math.abs(Math.sin(scalingStep / 4));
      const scaleY = Math.abs(Math.cos(scalingStep / 5));
      const scaleZ = Math.abs(Math.sin(scalingStep / 7));
      cylinder.scale.set(scaleX, scaleY, scaleZ);
      // render using requestAnimationFrame
      animationId = requestAnimationFrame(renderScene);
      renderer.render(scene, camera);
    }

    renderScene()

    return () => {
      trackballControls.update();
      
      gui.destroy();
      animationId && cancelAnimationFrame(animationId);
    };
  }, []);
  return <div ref={wrapRef} className="gl-wrapper"></div>;

}

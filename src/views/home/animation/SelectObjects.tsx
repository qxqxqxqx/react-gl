/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-26 15:33:57
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-09-28 17:15:28
 * @Description: 选择对象
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

export default function SelectObjects(params: any): ReactElement {
  const wrapRef = useRef(null);
  const handleMouseDown = useRef((e:any):void => {})
  const handleMouseMove = useRef((e:any):void => {})
  useEffect(() => {
    const gui = new dat.GUI();
    let animationId: number | null = null;
    const wrap = wrapRef.current;
    let tube:THREE.Mesh;
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
      showRay: boolean
    }
    const Controls = function (this: Controls) {

      // the start geometry and material. Used as the base for the settings in the control UI
      this.rotationSpeed = 0.02;
      this.bouncingSpeed = 0.03;
      this.scalingSpeed = 0.03;
      this.showRay = false;
    } as any as { new(): Controls; };;
    const controls = new Controls();

    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, 'bouncingSpeed', 0, 0.5);
    gui.add(controls, 'scalingSpeed', 0, 0.5);
    gui.add(controls, 'showRay').onChange(function (e) {
      if (tube) scene.remove(tube)
    });

    let step = 0;
    let scalingStep = 0;
    const renderScene = (): void => {

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

    renderScene();

    handleMouseDown.current = (e: any): void => {
      e.persist();
      const wrap:any = wrapRef.current;
      const { top, left, width, height } = wrap.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      let vector = new THREE.Vector3((x / width) * 2 - 1, -(y / height) * 2 + 1, 0.5);
      vector = vector.unproject(camera);

      const raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
      const intersects = raycaster.intersectObjects([sphere, cylinder, cube]);

      if (intersects.length > 0) {
        const mesh: any = intersects[0].object;
        mesh.material.transparent = true;
        mesh.material.opacity = 0.1;
      }
    }

    handleMouseMove.current = (e: any): void => {
      if (controls.showRay) {
        const wrap: any = wrapRef.current;
        const { top, left, width, height } = wrap.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        let vector = new THREE.Vector3((x / width) * 2 - 1, -(y / height) * 2 + 1, 0.5);
        vector = vector.unproject(camera);

        const raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
        const intersects = raycaster.intersectObjects([sphere, cylinder, cube]);

        if (intersects.length > 0) {

          const points = [];
          points.push(new THREE.Vector3(-30, 39.8, 30));
          points.push(intersects[0].point);

          const mat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.6 });
          const tubeGeometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 60, 0.001);

          if (tube)
            scene.remove(tube);

          if (controls.showRay) {
            tube = new THREE.Mesh(tubeGeometry, mat);
            scene.add(tube);
          }
        }
      }
    }

    return () => {
      gui.destroy();
      animationId && cancelAnimationFrame(animationId);
    };
  }, []);
  return <div ref={wrapRef} className="gl-wrapper" onClick={e => handleMouseDown.current(e)} onMouseMove={e => handleMouseMove.current(e)}></div>;

}


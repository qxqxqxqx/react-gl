/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-07 17:19:29
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-21 17:57:40
 * @Description: 粒子云
 */
import React, { useRef, useEffect, ReactElement } from "react";
import * as THREE from 'three';
import * as dat from 'dat.gui';
import {
  initRenderer,
  initCamera,
  initTrackballControls
} from '../../../util/util.js';

export default function Particles(props: any): ReactElement {

  const wrapRef = useRef(null);
  useEffect(() => {
    const gui = new dat.GUI();
    let animationId: number | null = null;
    if (wrapRef.current) {
      const wrap = wrapRef.current;
      // init renderer
      const renderer = initRenderer(wrap, undefined);
      // init camera
      const camera = initCamera(wrap, undefined);
      // init scene
      const scene: any = new THREE.Scene();
      // position and point the camera to the center of the scene
      camera.position.set(20, 0, 150);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      // init trackballControls
      const trackballControls = initTrackballControls(camera, renderer);

      let cloud: any;

      const createParticles = (
        size: number,
        transparent: boolean,
        opacity: number,
        vertexColors: boolean,
        sizeAttenuation: boolean,
        colorValue: any,
        vertexColorValue: any
      ):void => {
        const geom = new THREE.Geometry();
        const material = new THREE.PointsMaterial({
          size,
          transparent,
          opacity,
          vertexColors,
          sizeAttenuation,
          color: new THREE.Color(colorValue)
        });
        const range = 500;
        for (let i = 0; i < 15000; i++) {
          const particle = new THREE.Vector3(Math.random() * range - range / 2, Math.random() * range - range / 2,
            Math.random() * range - range / 2);
          geom.vertices.push(particle);
          const color = new THREE.Color(vertexColorValue);
          let asHSL: THREE.HSL = color.getHSL({ h: 1, s: 1, l: 1 });
          color.setHSL(asHSL.h, asHSL.s, asHSL.l * Math.random());
          geom.colors.push(color);
        }
        cloud = new THREE.Points(geom, material);
        cloud.name = "particles";
        scene.add(cloud);
      }

      interface Controls {
        // members of your "class" go here
        size: number,
        transparent: boolean,
        opacity: number,
        vertexColors: boolean,
        color: number,
        vertexColor: number,
        sizeAttenuation: boolean,
        redraw: any,
        rotate: boolean
      }
      const Controls = function (this: Controls) {

        // the start geometry and material. Used as the base for the settings in the control UI
        this.size = 4;
        this.transparent = true;
        this.opacity = 0.6;
        this.vertexColors = true;
        this.color = 0xffffff;
        this.vertexColor = 0x00ff00;
        this.sizeAttenuation = true;
        this.rotate = true;

        this.redraw = function () {

          if (scene.getObjectByName("particles")) {
            scene.remove(scene.getObjectByName("particles"));
          }
          createParticles(controls.size, controls.transparent, controls.opacity, controls.vertexColors,
            controls.sizeAttenuation, controls.color, controls.vertexColor);
        };
      } as any as { new(): Controls; };;
      const controls = new Controls();
      
      gui.add(controls, 'size', 0, 10).onChange(controls.redraw);
      gui.add(controls, 'transparent').onChange(controls.redraw);
      gui.add(controls, 'opacity', 0, 1).onChange(controls.redraw);
      gui.add(controls, 'vertexColors').onChange(controls.redraw);
      gui.addColor(controls, 'color').onChange(controls.redraw);
      gui.addColor(controls, 'vertexColor').onChange(controls.redraw);
      gui.add(controls, 'sizeAttenuation').onChange(controls.redraw);
      gui.add(controls, 'rotate');

      controls.redraw();


      let step = 0;
      const render = (): void => {
        trackballControls.update();
        if (controls.rotate) {
          step += 0.01;
          cloud.rotation.x = step;
          cloud.rotation.z = step;
        }
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

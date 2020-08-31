/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-31 18:09:14
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-31 20:17:26
 * @Description: animationMixer animationAction animationClip
 */
// TODO: finish
import React, { useRef, useEffect, ReactElement } from "react";
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { initRenderer, initCamera, initTrackballControls, initDefaultLighting } from '../../../util/util.js';
import rainball from '../../../assets/textures/particles/raindrop-3.png';
import { AnimationMixer, AnimationAction, Mesh } from 'three';

export default function MorphTargets(props: any): ReactElement {

  const wrapRef = useRef(null);
  useEffect(() => {
    const gui = new dat.GUI();
    let animationId: number | null = null;
    if (wrapRef.current) {
      const wrap = wrapRef.current;
      // init renderer
      const renderer = initRenderer(wrap, undefined);
      // init camera
      const camera = initCamera(wrap);
      camera.position.set(0, 15, 70);
      const trackballControls = initTrackballControls(camera, renderer);



      
      // init scene
      const scene: any = new THREE.Scene();
      // position and point the camera to the center of the scene

      const clock = new THREE.Clock();

      let mixer: AnimationMixer;
      let clipAction: AnimationAction;
      let frameMesh: Mesh;
      let mesh: Mesh;

      initDefaultLighting(scene);

      let cloud: any;

      const createPointCloud = (
        size: number,
        transparent: boolean,
        opacity: number,
        sizeAttenuation: boolean,
        color: any
      ): void => {
        const texture = new THREE.Texture();
        const img = new Image();
        img.src = rainball;
        img.onload = function () {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = 128;
          canvas.width = 128;
          if (context) {
            context.drawImage(img, 0, 0, 128, 128, 0, 0, 128, 128);
          }
          texture.image = canvas;
          texture.format = THREE.RGBAFormat;
          texture.needsUpdate = true;
        }
        const geom = new THREE.Geometry();

        const material = new THREE.PointsMaterial({
          size: size,
          transparent: transparent,
          opacity: opacity,
          map: texture,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: sizeAttenuation,
          color: color
        });
        const range = 40;
        for (let i = 0; i < 1500; i++) {
          const particle: any = new THREE.Vector3(
            Math.random() * range - range / 2,
            Math.random() * range * 1.5,
            // Math.random() * range - range / 2
            1 + (i / 100)
          )
          particle.velocityY = 0.1 + Math.random() / 5;
          particle.velocityX = (Math.random() - 0.5) / 3;
          geom.vertices.push(particle);
        }

        cloud = new THREE.Points(geom, material);
        cloud.sortParticles = true;
        cloud.name = "particles1";
        scene.add(cloud);
      }

      interface Controls {
        // members of your "class" go here
        size: number,
        transparent: boolean,
        opacity: number,
        color: number,
        sizeAttenuation: boolean,
        redraw: any,
        rotate: boolean
      }
      const Controls = function (this: Controls) {

        // the start geometry and material. Used as the base for the settings in the control UI
        this.size = 3;
        this.transparent = true;
        this.opacity = 0.6;
        this.color = 0xffffff;
        this.sizeAttenuation = true;

        this.redraw = function () {
          scene.remove(scene.getObjectByName("particles1"));
          createPointCloud(controls.size, controls.transparent, controls.opacity, controls.sizeAttenuation, controls.color);
        };
      } as any as { new(): Controls; };;
      const controls = new Controls();
      gui.add(controls, 'size', 0, 10).onChange(controls.redraw);
      gui.add(controls, 'transparent').onChange(controls.redraw);
      gui.add(controls, 'opacity', 0, 1).onChange(controls.redraw);
      gui.addColor(controls, 'color').onChange(controls.redraw);
      gui.add(controls, 'sizeAttenuation').onChange(controls.redraw);

      controls.redraw();

      const render = (): void => {
        const vertices = cloud.geometry.vertices;
        vertices.forEach(function (v: any) {
          v.y = v.y - (v.velocityY);
          v.x = v.x - (v.velocityX);
          if (v.y <= 0) v.y = 60;
          if (v.x <= -20 || v.x >= 20) v.velocityX = v.velocityX * -1;
        });
        cloud.geometry.verticesNeedUpdate = true;
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

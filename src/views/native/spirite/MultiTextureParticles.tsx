/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-11 17:17:40
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-21 18:07:09
 * @Description: 多种纹理
 */
import React, { useRef, useEffect, ReactElement } from "react";
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { initRenderer, initCamera } from '../../../util/util.js';
import snowflake1 from "../../../assets/textures/particles/snowflake1_t.png";
import snowflake2 from "../../../assets/textures/particles/snowflake2_t.png";
import snowflake3 from "../../../assets/textures/particles/snowflake3_t.png";
import snowflake4 from "../../../assets/textures/particles/snowflake4_t.png";

export default function MultiTextureParticles(props: any): ReactElement {

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
      camera.lookAt(new THREE.Vector3(20, 30, 0));
      // init scene
      const scene: any = new THREE.Scene();
      // position and point the camera to the center of the scene

      const createPointCloud = (
        name: string,
        src: string,
        size: number,
        transparent: boolean,
        opacity: number,
        sizeAttenuation: boolean,
        color: number
      ): THREE.Points => {
        // TODO: TextureLoader do not work!!!
        const texture = new THREE.Texture();
        const img = new Image();
        img.src = src;
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
        const colors: any = new THREE.Color(color);
        colors.setHSL(colors.getHSL(colors).h, colors.getHSL(colors).s, (Math.random()) * colors.getHSL(colors).l);
        const material = new THREE.PointsMaterial({
          size: size,
          transparent: transparent,
          opacity: opacity,
          map: texture,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          sizeAttenuation: sizeAttenuation,
          color: colors
        });
        const range = 40;
        for (let i = 0; i < 150; i++) {
          const particle: any = new THREE.Vector3(
            Math.random() * range - range / 2,
            Math.random() * range * 1.5,
            Math.random() * range - range / 2);
          particle.velocityY = 0.1 + Math.random() / 5;
          particle.velocityX = (Math.random() - 0.5) / 3;
          particle.velocityZ = (Math.random() - 0.5) / 3;
          geom.vertices.push(particle);
        }
        const cloud: any = new THREE.Points(geom, material);
        cloud.sortParticles = true;
        cloud.name = name;
        return cloud;
      }

      const createPointInstances = (
        size: number,
        transparent: boolean,
        opacity: number,
        sizeAttenuation: boolean,
        color: number): void => {

        scene.add(createPointCloud("system1", snowflake1, size, transparent, opacity, sizeAttenuation, color));
        scene.add(createPointCloud("system2", snowflake2, size, transparent, opacity, sizeAttenuation, color));
        scene.add(createPointCloud("system3", snowflake3, size, transparent, opacity, sizeAttenuation, color));
        scene.add(createPointCloud("system4", snowflake4, size, transparent, opacity, sizeAttenuation, color));
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
        this.size = 10;
        this.transparent = true;
        this.opacity = 0.6;
        this.color = 0xffffff;
        this.sizeAttenuation = true;

        this.redraw = function () {
          const toRemove: THREE.Points[] = [];
          scene.children.forEach(function (child: any) {
            if (child instanceof THREE.Points) {
              toRemove.push(child);
            }
          });
          toRemove.forEach(function (child) {
            scene.remove(child)
          });
          createPointInstances(controls.size, controls.transparent, controls.opacity, controls.sizeAttenuation, controls.color);
        };
      } as any as { new(): Controls; };;
      const controls = new Controls();
      gui.add(controls, 'size', 0, 20).onChange(controls.redraw);
      gui.add(controls, 'transparent').onChange(controls.redraw);
      gui.add(controls, 'opacity', 0, 1).onChange(controls.redraw);
      gui.addColor(controls, 'color').onChange(controls.redraw);
      gui.add(controls, 'sizeAttenuation').onChange(controls.redraw);
      controls.redraw();

      const render = (): void => {
        scene.children.forEach(function (child: any) {
          if (child instanceof THREE.Points) {
            var vertices = child.geometry.vertices;
            vertices.forEach(function (v: any) {
              v.y = v.y - (v.velocityY);
              v.x = v.x - (v.velocityX);
              v.z = v.z - (v.velocityZ);
              if (v.y <= 0) v.y = 60;
              if (v.x <= -20 || v.x >= 20) v.velocityX = v.velocityX * -1;
              if (v.z <= -20 || v.z >= 20) v.velocityZ = v.velocityZ * -1;
            });

            child.geometry.verticesNeedUpdate = true;
          }
        });
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

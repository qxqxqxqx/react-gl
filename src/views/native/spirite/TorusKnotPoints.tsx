/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-12 11:21:58
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-21 18:14:34
 * @Description: point组成环状纽结 
 */
import React, { useRef, useEffect, ReactElement } from "react";
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { initRenderer, initCamera } from '../../../util/util.js';

export default function TorusKnotPoints(props: any): ReactElement {
  const wrapRef = useRef(null);
  useEffect(() => {
    const gui = new dat.GUI();
    let animationId: number | null = null;
    if (wrapRef.current) {
      const wrap: any = wrapRef.current;
      // init renderer
      const webGLRenderer = initRenderer(wrap, undefined);
      // init camera
      const camera = initCamera(wrap, new THREE.Vector3(-30, 40, 50));
      // camera.lookAt(new THREE.Vector3(20, 30, 0));
      // init scene
      const scene: any = new THREE.Scene();
      const generateSprite = (): THREE.Texture => {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const context: any = canvas.getContext('2d');
        const gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
        gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
        gradient.addColorStop(1, 'rgba(0,0,0,1)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
      }
      const createPoints = (geom: THREE.TorusKnotGeometry): THREE.Points => {
        const material = new THREE.PointsMaterial({
          color: 0xffffff,
          size: 3,
          transparent: true,
          blending: THREE.AdditiveBlending,
          map: generateSprite(),
          depthWrite: false // instead of sortParticles
        });
        const cloud = new THREE.Points(geom, material);
        return cloud;
      }

      interface Controls {
        // members of your "class" go here
        radius: number,
        tube: number,
        radialSegments: number,
        tubularSegments: number,
        p: number,
        q: number,
        redraw: any,
        asParticles: boolean,
        rotate: boolean
      }
      let knot: any;
      const Controls = function (this: Controls) {

        // the start geometry and material. Used as the base for the settings in the control UI
        this.radius = 13;
        this.tube = 1.7;
        this.radialSegments = 156;
        this.tubularSegments = 12;
        this.p = 5;
        this.q = 4;
        this.asParticles = false;
        this.rotate = false;

        this.redraw = function () {
          // remove the old plane
          if (knot) scene.remove(knot);
          // create a new one
          const geom = new THREE.TorusKnotGeometry(controls.radius, controls.tube, Math.round(controls.radialSegments), Math.round(controls.tubularSegments), Math.round(controls.p), Math.round(controls.q));

          if (controls.asParticles) {
            knot = createPoints(geom);
          } else {
            knot = new THREE.Mesh(geom, new THREE.MeshNormalMaterial());
          }

          // add it to the scene.
          scene.add(knot);
        }
      } as any as { new(): Controls; };;
      const controls = new Controls();
      gui.add(controls, 'radius', 0, 40).onChange(controls.redraw);
      gui.add(controls, 'tube', 0, 40).onChange(controls.redraw);
      gui.add(controls, 'radialSegments', 0, 400).step(1).onChange(controls.redraw);
      gui.add(controls, 'tubularSegments', 1, 20).step(1).onChange(controls.redraw);
      gui.add(controls, 'p', 1, 10).step(1).onChange(controls.redraw);
      gui.add(controls, 'q', 1, 15).step(1).onChange(controls.redraw);
      gui.add(controls, 'asParticles').onChange(controls.redraw);
      gui.add(controls, 'rotate').onChange(controls.redraw);
      controls.redraw();

      let step = 0;
      const render = (): void => {
        if (controls.rotate) {
          knot.rotation.y = step += 0.01;
        }
        animationId = requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);
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

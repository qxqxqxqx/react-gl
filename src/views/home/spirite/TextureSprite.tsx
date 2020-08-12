/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-11 19:36:58
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-12 11:23:11
 * @Description: 使用精灵贴图做纹理
 */
import React, { useRef, useEffect, ReactElement } from "react";
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { initRenderer, initCamera } from '../../../util/util.js';
import spriteSheet from '../../../assets/textures/particles/sprite-sheet.png';

export default function TextureSprite(props: any): ReactElement {

  const wrapRef = useRef(null);
  useEffect(() => {
    const gui = new dat.GUI();
    if (wrapRef.current) {
      const wrap: any = wrapRef.current;
      // init renderer
      const webGLRenderer = initRenderer(wrap, undefined);
      // init camera
      const camera = initCamera(wrap, new THREE.Vector3(0, 0, 50));
      // camera.lookAt(new THREE.Vector3(20, 30, 0));
      const cameraOrtho = new THREE.OrthographicCamera(0, wrap.clientWidth, wrap.clientHeight, 0, -10, 10);
      // init scene
      const scene: any = new THREE.Scene();
      const sceneOrtho: any = new THREE.Scene();
      // position and point the camera to the center of the scene

      const material = new THREE.MeshNormalMaterial();
      const geom = new THREE.SphereGeometry(15, 20, 20);
      const mesh = new THREE.Mesh(geom, material);

      scene.add(mesh);

      const createSprite = (
        size: number,
        transparent: boolean,
        opacity: number,
        color: number,
        spriteNumber: number
      ): void => {
        // TODO: TextureLoader do not work!!!
        const texture = new THREE.Texture();
        const img = new Image();
        img.src = spriteSheet;
        img.onload = function () {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          const { width, height } = img;
          canvas.width = width;
          canvas.height = height;
          if (context) {
            context.drawImage(img, 0, 0, width, height, 0, 0, width, height);
          }
          texture.image = canvas;
          texture.format = THREE.RGBAFormat;
          texture.needsUpdate = true;
        }
        const spriteMaterial: any = new THREE.SpriteMaterial({
          opacity: opacity,
          color: color,
          transparent: transparent,
          map: texture
        });
        // we have 1 row, with five sprites
        /**       v
         *        |
         *        |————|————|————|————|————|
         *        | 😊   😈   😍  😋   😄
         * -------|————|————|————|————|————|----u
         *        |
         *        |
         *        |
         * map.offset 决定纹理在x轴上的偏移量     (0-1)
         * map.repeat 决定放大比例 1/5           (0-1)
         *
         */
        spriteMaterial.map.offset = new THREE.Vector2(0.2 * spriteNumber, 0);
        spriteMaterial.map.repeat = new THREE.Vector2(1 / 5, 1);
        spriteMaterial.blending = THREE.AdditiveBlending;
        // make sure the object is always rendered at the front
        spriteMaterial.depthTest = false;

        const sprite: any = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(size, size, size);
        sprite.position.set(100, 50, -10);
        sprite.velocityX = 5;

        sceneOrtho.add(sprite);
      }

      interface Controls {
        // members of your "class" go here
        size: number,
        sprite: number,
        transparent: boolean,
        opacity: number,
        color: number,
        sizeAttenuation: boolean,
        redraw: any,
        rotateSystem: boolean
      }
      const Controls = function (this: Controls) {

        // the start geometry and material. Used as the base for the settings in the control UI
        this.size = 150;
        this.sprite = 0;
        this.transparent = true;
        this.opacity = 0.6;
        this.color = 0xffffff;
        this.rotateSystem = true;

        this.redraw = function () {
          sceneOrtho.children.forEach(function (child: any) {
            if (child instanceof THREE.Sprite) sceneOrtho.remove(child);
          });
          createSprite(controls.size, controls.transparent, controls.opacity, controls.color, controls.sprite);
        };
      } as any as { new(): Controls; };;
      const controls = new Controls();
      gui.add(controls, 'sprite', 0, 4).step(1).onChange(controls.redraw);
      gui.add(controls, 'size', 0, 120).onChange(controls.redraw);
      gui.add(controls, 'transparent').onChange(controls.redraw);
      gui.add(controls, 'opacity', 0, 1).onChange(controls.redraw);
      gui.addColor(controls, 'color').onChange(controls.redraw);
      controls.redraw();

      interface SuperSprite extends THREE.Sprite {
        velocityX: number,
        material: any
      }

      let step = 0;
      const render = (): void => {
        camera.position.y = Math.sin(step += 0.01) * 20;
        sceneOrtho.children.forEach(function (e: SuperSprite) {
          if (e instanceof THREE.Sprite) {
            // move the sprite along the bottom
            e.position.x = e.position.x + e.velocityX;
            if (e.position.x > window.innerWidth) {
              e.velocityX = -5;
              controls.sprite += 1;
              e.material.map.offset.set(1 / 5 * (controls.sprite % 4), 0);
            }
            if (e.position.x < 0) {
              e.velocityX = 5;
            }
          }
        });
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);
        webGLRenderer.autoClear = false;
        webGLRenderer.render(sceneOrtho, cameraOrtho);
      }
      render();
    }
    return () => {
      gui.destroy()
    }
  }, []);

  return <div ref={wrapRef} className="gl-wrapper"></div>;

}

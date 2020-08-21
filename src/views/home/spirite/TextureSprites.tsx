/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-12 10:24:33
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-21 18:12:06
 * @Description: 三维空间中定位粒子时使用精灵贴图 
 */
import React, { useRef, useEffect, ReactElement } from "react";
import * as THREE from 'three';
import { initRenderer, initCamera } from '../../../util/util.js';
import spriteSheet from '../../../assets/textures/particles/sprite-sheet.png';

export default function TextureSprites(props: any): ReactElement {

  const wrapRef = useRef(null);
  useEffect(() => {
    let animationId: number | null = null;
    if (wrapRef.current) {
      const wrap: any = wrapRef.current;
      // init renderer
      const webGLRenderer = initRenderer(wrap, undefined);
      // init camera
      const camera = initCamera(wrap, new THREE.Vector3(20, 0, 150));
      camera.lookAt(new THREE.Vector3(20, 30, 0));
      // init scene
      const scene: any = new THREE.Scene();
      // position and point the camera to the center of the scene

      const material = new THREE.MeshNormalMaterial();
      const geom = new THREE.SphereGeometry(15, 20, 20);
      const mesh = new THREE.Mesh(geom, material);

      scene.add(mesh);

      let group: THREE.Object3D;
      const createSprites = (): void => {
        group = new THREE.Object3D();
        var range = 200;
        for (var i = 0; i < 400; i++) {
          group.add(createSprite(10, false, 0.6, 0xffffff, i % 5, range));
        }
        scene.add(group);
      }

      const createSprite = (
        size: number,
        transparent: boolean,
        opacity: number,
        color: number,
        spriteNumber: number,
        range: number
      ): THREE.Sprite => {
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
        /**       ^ v
         *        |
         *        |————|————|————|————|————|
         *        | 😊   😈   😍  😋   😄 
         * -------|————|————|————|————|————|---->u
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
        sprite.position.set(
          Math.random() * range - range / 2,
          Math.random() * range - range / 2,
          Math.random() * range - range / 2);

        return sprite;
      }
      createSprites();
      const render = (): void => {
        group.rotation.x += 0.01;
        animationId = requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);
      }
      render();
    }
    return () => {
      animationId && cancelAnimationFrame(animationId);
    }
  }, []);

  return <div ref={wrapRef} className="gl-wrapper"></div>;

}


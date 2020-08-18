/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-18 20:16:05
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-18 20:23:11
 * @Description: PLYLoader
 */
import React, { useRef, useEffect, ReactElement } from "react";
import * as THREE from 'three';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import BaseLoaderScene from './baseLoaderScene';
import { initCamera } from '../../../util/util.js';

export default function PLYLoad(props: any): ReactElement {

  const wrapRef = useRef(null);
  useEffect(() => {
    if (wrapRef.current) {
      const wrap = wrapRef.current;
      // init camera
      const camera = initCamera(wrap, new THREE.Vector3(30, 30, 30));
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      const loaderScene = new BaseLoaderScene(wrap, camera, undefined, undefined, undefined);
      const loader = new PLYLoader();

      const generateSprite = (): THREE.Texture => {

        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const context: any = canvas.getContext('2d');

        // draw the sprites
        const gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
        gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
        gradient.addColorStop(1, 'rgba(0,0,0,1)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // create the texture
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
      }
      loader.load(`${process.env.PUBLIC_URL}/models/carcloud/carcloud.ply`, function (geometry) {

        const material = new THREE.PointsMaterial({
          color: 0xffffff,
          size: 1,
          opacity: 0.6,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          map: generateSprite()
        });

        const group = new THREE.Points(geometry, material);
        group.scale.set(2.5, 2.5, 2.5);

        loaderScene.render(group, camera);
      });
    }
    return () => { }
  }, []);

  return <div ref={wrapRef} className="gl-wrapper"></div>;

}

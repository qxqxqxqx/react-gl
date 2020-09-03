/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-26 17:47:13
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-09-02 17:33:54
 * @Description: 用tween.js实现动画
 */
import React, { useRef, useEffect, ReactElement } from "react";
import TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import BaseLoaderScene from '../../../util/baseLoaderScene';
import { initCamera } from '../../../util/util.js';

export default function TweenAnimation(props: any): ReactElement {

  const wrapRef = useRef(null);
  useEffect(() => {
    let animationId: number | null = null;
    if (wrapRef.current) {
      const wrap = wrapRef.current;
      // init camera
      const camera = initCamera(wrap, new THREE.Vector3(30, 30, 30));
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      const posSrc = { pos: 1 }
      const tween = new TWEEN.Tween(posSrc)
        .to({ pos: 0 }, 2000)
        .easing(TWEEN.Easing.Bounce.InOut)
      const tweenBack = new TWEEN.Tween(posSrc)
        .to({ pos: 1 }, 2000)
        .easing(TWEEN.Easing.Bounce.InOut);
      tweenBack.chain(tween);
      tween.chain(tweenBack);
      tween.start(2000);
      const loaderScene = new BaseLoaderScene(wrap, camera, false, true, function (mesh: any, time: any, id:any) {
        animationId = id;
        TWEEN.update(time);
        const positionArray = mesh.geometry.attributes['position'];
        const origPosition = mesh.geometry.origPosition;
        for (let i = 0; i < positionArray.count; i++) {
          const oldPosX = origPosition.getX(i);
          const oldPosY = origPosition.getY(i);
          const oldPosZ = origPosition.getZ(i);
          positionArray.setX(i, oldPosX * posSrc.pos);
          positionArray.setY(i, oldPosY * posSrc.pos);
          positionArray.setZ(i, oldPosZ * posSrc.pos);
        }
        positionArray.needsUpdate = true;
      });
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
      loader.load(`${process.env.PUBLIC_URL}/models/carcloud/carcloud.ply`, function (geometry: any) {

        const material = new THREE.PointsMaterial({
          color: 0xffffff,
          size: 1,
          opacity: 0.6,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          map: generateSprite()
        });

        // copy the original position, so we can referene that when tweening
        const origPosition = geometry.attributes['position'].clone()
        geometry.origPosition = origPosition

        const group = new THREE.Points(geometry, material);
        group.scale.set(2.5, 2.5, 2.5);

        loaderScene.render(group, camera);
      });
    }
    return () => { 
      animationId && cancelAnimationFrame(animationId);
    }
  }, []);

  return <div ref={wrapRef} className="gl-wrapper"></div>;

}

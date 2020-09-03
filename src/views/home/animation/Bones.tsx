/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-09-02 17:33:12
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-09-03 16:34:50
 * @Description: 骨骼动画
 */
import React, { useRef, useEffect, ReactElement } from "react";
import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import * as dat from 'dat.gui';
import {
  initRenderer,
  initCamera,
  initDefaultLighting,
  initTrackballControls
} from '../../../util/util.js';
import { LegacyJSONLoader } from '../../../util/LegacyJSONLoader';
import { initBones } from '../../../util/animationUtil';

export default function Bones(props: any): ReactElement {

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

      scene.add(new THREE.AmbientLight(0x333333));
      initDefaultLighting(scene);
      // position and point the camera to the center of the scene
      camera.position.set(0, 15, 70);
      // init trackballControls
      const trackballControls = initTrackballControls(camera, renderer);

      const loader = new LegacyJSONLoader();
      let mesh: THREE.SkinnedMesh;
      let skeletonHelper: any;
      let tween: any;

      const onUpdate = (obj: any) => {
        const {pos} = obj;
        // rotate the fingers
        mesh.skeleton.bones[5].rotation.set(0, 0, pos);
        mesh.skeleton.bones[6].rotation.set(0, 0, pos);
        mesh.skeleton.bones[10].rotation.set(0, 0, pos);
        mesh.skeleton.bones[11].rotation.set(0, 0, pos);
        mesh.skeleton.bones[15].rotation.set(0, 0, pos);
        mesh.skeleton.bones[16].rotation.set(0, 0, pos);
        mesh.skeleton.bones[20].rotation.set(0, 0, pos);
        mesh.skeleton.bones[21].rotation.set(0, 0, pos);
        // rotate the wristskeleton
        mesh.skeleton.bones[1].rotation.set(pos, 0, 0);
      };

      const startAnimation = () => {
        tween = new TWEEN.Tween({ pos: -1.5 })
          .to({ pos: 0 }, 3000)
          .easing(TWEEN.Easing.Cubic.InOut)
          .yoyo(true)
          .repeat(Infinity)
          .onUpdate(onUpdate);

        tween.start(1.5);
      }     


      loader.load(`${process.env.PUBLIC_URL}/models/hand/hand-1.js`, function (geometry, mat) {
        
        const bufferGeo = new THREE.BufferGeometry().fromGeometry(geometry);
        const material = new THREE.MeshLambertMaterial({ color: 0xF0C8C9, skinning: true });
        mesh = new THREE.SkinnedMesh(bufferGeo, material);
        // create bones
        const bones = initBones(geometry);
        const skeleton = new THREE.Skeleton(bones);
        // create skinned mesh and skeleton
        // see example from THREE.Skeleton
        const rootBone = skeleton.bones[0];
        mesh.add(rootBone);
        // bind the skeleton to the mesh
        mesh.bind(skeleton);
        mesh.scale.set(15, 15, 15);
        mesh.position.x = -5;
        mesh.rotateX(0.5 * Math.PI);
        mesh.rotateZ(0.3 * Math.PI);
        scene.add(mesh);

        startAnimation();
        
        const controls = {
          showHelper: false
        }
        
        gui.add(controls, "showHelper").onChange(function (e) {
          if (e) {
            skeletonHelper = new THREE.SkeletonHelper(mesh);
            skeletonHelper.material.linewidth = 2;
            scene.add(skeletonHelper);
          } else {
            if (skeletonHelper) {
              scene.remove(skeletonHelper)
            }
          }
        });
      });

      const render = (): void => {
        TWEEN.update(Date.now());
        trackballControls.update();
        requestAnimationFrame(render);
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


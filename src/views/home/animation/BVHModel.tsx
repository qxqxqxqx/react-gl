/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-09-04 14:12:03
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-09-04 16:14:26
 * @Description: bvh model 动画
 */
import React, { useRef, useEffect, ReactElement } from "react";
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { BVHLoader } from 'three/examples/jsm/loaders/BVHLoader';
import {
  initRenderer,
  initCamera,
  initDefaultLighting,
  initTrackballControls
} from '../../../util/util.js';
import { addClipActionFolder } from '../../../util/animationUtil';

export default function BVHModel(props: any): ReactElement {

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
      camera.position.set(0, 0, -300);
      // init trackballControls
      const trackballControls = initTrackballControls(camera, renderer);

      const clock = new THREE.Clock();

      let mixer: any;
      let clipAction: any;
      let controls: any;

      // control which keyframe to show
      const mixerControls = {
        time: 0,
        timeScale: 1,
        stopAllAction: function () { mixer.stopAllAction() },
      }

      const loader = new BVHLoader();;
      // we could also queue this or use promises
      loader.load(`${process.env.PUBLIC_URL}/models/amelia-dance/DanceNightClub7_t1.bvh`, function (result) {
        const skeletonHelper: any = new THREE.SkeletonHelper(result.skeleton.bones[0]);
        skeletonHelper.skeleton = result.skeleton; // allow animation mixer to bind to SkeletonHelper directly
        const boneContainer = new THREE.Object3D();
        boneContainer.translateY(-70);
        boneContainer.translateX(-100);
        boneContainer.add(result.skeleton.bones[0]);
        scene.add(skeletonHelper);
        scene.add(boneContainer);

        mixer = new THREE.AnimationMixer(skeletonHelper);
        clipAction = mixer.clipAction(result.clip).setEffectiveWeight(1.0).play();

        const mixerFolder = gui.addFolder("AnimationMixer");
        mixerFolder.add(mixerControls, "time").listen();
        mixerFolder.add(mixerControls, "timeScale", 0, 5).onChange(function (timeScale) { mixer.timeScale = timeScale });
        mixerFolder.add(mixerControls, "stopAllAction").listen();
        controls = addClipActionFolder("ClipAction", gui, clipAction, result.clip);

      });

      const render = (): void => {
        const delta = clock.getDelta();
        trackballControls.update();
        requestAnimationFrame(render);
        renderer.render(scene, camera);
        if (mixer && clipAction && controls) {
          mixer.update(delta);
          controls.time = mixer.time;
          controls.effectiveTimeScale = clipAction.getEffectiveTimeScale();
          controls.effectiveWeight = clipAction.getEffectiveWeight();
        }
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





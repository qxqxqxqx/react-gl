/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-09-03 17:20:50
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-09-03 17:29:44
 * @Description: 加载collada模型动画
 */
import React, { useRef, useEffect, ReactElement } from "react";
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
import {
  initRenderer,
  initCamera,
  initDefaultLighting,
  initTrackballControls
} from '../../../util/util.js';
import { addClipActionFolder } from '../../../util/animationUtil';

export default function ColladaModel(props: any): ReactElement {

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
      camera.position.set(0, 70, 100);
      // init trackballControls
      const trackballControls = initTrackballControls(camera, renderer);

      const clock = new THREE.Clock();

      let mixer: THREE.AnimationMixer;
      let clipAction: any;
      let animationClip: any;
      let controls: any;


      // control which keyframe to show
      const mixerControls = {
        time: 0,
        timeScale: 1,
        stopAllAction: function () { mixer.stopAllAction() },
      }

      

      const enableControls = () => {
        const mixerFolder = gui.addFolder("AnimationMixer")
        mixerFolder.add(mixerControls, "time").listen()
        mixerFolder.add(mixerControls, "timeScale", 0, 5).onChange(function (timeScale) { mixer.timeScale = timeScale });
        mixerFolder.add(mixerControls, "stopAllAction").listen()

        controls = addClipActionFolder("ClipAction 1", gui, clipAction, animationClip);
      }

      const loader = new ColladaLoader();

      loader.load(`${process.env.PUBLIC_URL}/models/monster/monster.dae`, function (result) {
        

        scene.add(result.scene);
        result.scene.rotateZ(-0.2 * Math.PI)
        result.scene.translateX(-20)
        result.scene.translateY(-20)

        // setup the mixer
        mixer = new THREE.AnimationMixer(result.scene);
        animationClip = result.animations[0];
        clipAction = mixer.clipAction(animationClip).play();
        animationClip = clipAction.getClip();

        // // add the animation controls
        enableControls();
      });

      const render = (): void => {
        const delta = clock.getDelta();
        trackballControls.update();
        requestAnimationFrame(render);
        renderer.render(scene, camera)

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

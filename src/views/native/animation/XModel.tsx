/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-09-03 20:05:17
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-09-04 14:10:12
 * @Description: 加载directx模型
 */
import React, { useRef, useEffect, ReactElement } from "react";
import * as THREE from 'three';
import * as dat from 'dat.gui';
// import { XLoader } from 'three/examples/jsm/loaders/XLoader';
import {
  initRenderer,
  initCamera,
  initDefaultLighting,
  initTrackballControls
} from '../../../util/util.js';
import { addClipActionFolder } from '../../../util/animationUtil';
import { XLoader } from '../../../util/XLoader';

export default function XModel(props: any): ReactElement {

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
      camera.position.set(0, 10, 70);
      // init trackballControls
      const trackballControls = initTrackballControls(camera, renderer);

      const clock = new THREE.Clock();

      let mixer: any;
      let clipAction: any;
      let animationClip: any;
      let controls: any;


      // control which keyframe to show
      const mixerControls = {
        time: 0,
        timeScale: 1,
        stopAllAction: function () { mixer.stopAllAction() },
      }

      const manager = new THREE.LoadingManager();
      const loader = new XLoader(manager);
      const animLoader:any = new XLoader(manager);
      // we could also queue this or use promises
      loader.load([`${process.env.PUBLIC_URL}/models/x/SSR06_model.x`], function (result) {
        const mesh:any = result.models[0];
        animLoader.load([`${process.env.PUBLIC_URL}/models/x/stand.x`, { putPos: false, putScl: false }], function (anim:any) {
          // assign animation to mesh
          animLoader.assignAnimation(mesh);
          // at this point we've got a normal mesh, and can get the mixer and clipactio
          // animationClip = anim.animations[0];
          mixer = mesh.animationMixer;
          // clipAction accept string parameter
          clipAction = mixer.clipAction('stand').play();
          animationClip = clipAction.getClip();
          const mixerFolder = gui.addFolder("AnimationMixer")
          mixerFolder.add(mixerControls, "time").listen()
          mixerFolder.add(mixerControls, "timeScale", 0, 20).onChange(function (timeScale) { mixer.timeScale = timeScale });
          mixerFolder.add(mixerControls, "stopAllAction").listen()

          controls = addClipActionFolder("ClipAction", gui, clipAction, animationClip);

          mesh.translateY(-6);
          // mesh.rotateY(-0.7 * Math.PI);
          scene.add(mesh);
        });
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




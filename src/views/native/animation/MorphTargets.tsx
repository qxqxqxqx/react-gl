/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-09-02 14:50:14
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-09-02 15:56:41
 * @Description: 使用多个animationClip对象
 */
import React, { useRef, useEffect, ReactElement } from "react";
import * as THREE from 'three';
import * as dat from 'dat.gui';
import {
  initRenderer,
  initCamera,
  initDefaultLighting,
  initTrackballControls
} from '../../../util/util.js';
import { addClipActionFolder } from '../../../util/animationUtil';

export default function MorphTargets(props: any): ReactElement {

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

      const clock = new THREE.Clock();

      let mixer: THREE.AnimationMixer;
      let clipAction: any;
      let clipAction2: any;
      let animationClip: any;
      let animationClip2: any;

      // control which keyframe to show
      let controls1: any;
      let controls2: any;
      const mixerControls = {
        time: 0,
        timeScale: 1,
        stopAllAction: function () { mixer.stopAllAction() },
      }

      const enableControls = () => {
        var mixerFolder = gui.addFolder("AnimationMixer")
        mixerFolder.add(mixerControls, "time").listen()
        mixerFolder.add(mixerControls, "timeScale", 0, 5).onChange(function (timeScale) { mixer.timeScale = timeScale });
        mixerFolder.add(mixerControls, "stopAllAction").listen()

        controls1 = addClipActionFolder("ClipAction 1", gui, clipAction, animationClip);
        controls2 = addClipActionFolder("ClipAction 2", gui, clipAction2, animationClip2);
      }

      const setupModel = (): void => {
        // initial cube
        const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
        const cubeMaterial = new THREE.MeshLambertMaterial({ morphTargets: true, color: 0xff0000 });

        // define morphtargets, we'll use the vertices from these geometries
        const cubeTarget1 = new THREE.BoxGeometry(2, 20, 2);
        const cubeTarget2 = new THREE.BoxGeometry(40, 2, 2);

        // define morphtargets and compute the morphnormal
        cubeGeometry.morphTargets[0] = { name: 't1', vertices: cubeGeometry.vertices };
        cubeGeometry.morphTargets[1] = { name: 't2', vertices: cubeTarget2.vertices };
        cubeGeometry.morphTargets[2] = { name: 't3', vertices: cubeTarget1.vertices };
        cubeGeometry.computeMorphNormals();

        const mesh = new THREE.Mesh(new THREE.BufferGeometry().fromGeometry(cubeGeometry), cubeMaterial);

        // position the cube
        mesh.position.x = 0;
        mesh.position.y = 3;
        mesh.position.z = 0;

        // add the cube to the scene
        scene.add(mesh);
        mixer = new THREE.AnimationMixer(mesh);

        animationClip = THREE.AnimationClip.CreateFromMorphTargetSequence('first', [cubeGeometry.morphTargets[0], cubeGeometry.morphTargets[1]], 1, false);
        animationClip2 = THREE.AnimationClip.CreateFromMorphTargetSequence('second', [cubeGeometry.morphTargets[0], cubeGeometry.morphTargets[2]], 1, false);
        clipAction = mixer.clipAction(animationClip).play();
        clipAction2 = mixer.clipAction(animationClip2).play();

        clipAction.setLoop(THREE.LoopRepeat);
        clipAction2.setLoop(THREE.LoopRepeat);
        // enable the controls
        enableControls()
      }
      setupModel();
      const render = (): void => {
        const delta = clock.getDelta();
        trackballControls.update();
        requestAnimationFrame(render);
        renderer.render(scene, camera)

        if (mixer && clipAction) {
          mixer.update(delta);
          controls1.time = mixer.time;
          controls1.effectiveTimeScale = clipAction.getEffectiveTimeScale();
          controls1.effectiveWeight = clipAction.getEffectiveWeight();
          controls2.time = mixer.time;
          controls2.effectiveTimeScale = clipAction.getEffectiveTimeScale();
          controls2.effectiveWeight = clipAction.getEffectiveWeight();
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


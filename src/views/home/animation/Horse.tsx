/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-09-02 15:59:25
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-09-02 17:38:12
 * @Description: animation mixer clip action
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
import { LegacyJSONLoader } from '../../../util/LegacyJSONLoader';

export default function Horse(props: any): ReactElement {

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
      let frameMesh: any;
      let mesh: any;
      let animationClip: any;

      const showFrame = (frame:any) =>{
        if (mesh) {
          scene.remove(frameMesh);
          const newVertices = mesh.geometry.morphTargets[frame].vertices
          frameMesh = mesh.clone();
          frameMesh.geometry.vertices = newVertices;
          frameMesh.translateX(-30);
          frameMesh.translateZ(-10);
          scene.add(frameMesh)
        }
      }
    
      const controls = {
        keyframe: 0,
        time: 0,
        timeScale: 1,
        repetitions: Infinity,
        stopAllAction: function () { mixer.stopAllAction() },

        // warp
        warpStartTimeScale: 1,
        warpEndTimeScale: 1,
        warpDurationInSeconds: 2,
        warp: function () { clipAction.warp(controls.warpStartTimeScale, controls.warpEndTimeScale, controls.warpDurationInSeconds) },
        fadeDurationInSeconds: 2,
        fadeIn: function () { clipAction.fadeIn(controls.fadeDurationInSeconds) },
        fadeOut: function () { clipAction.fadeOut(controls.fadeDurationInSeconds) },
        effectiveWeight: 0,
        effectiveTimeScale: 0
      }

      const enableControls = () => {
        const mixerFolder = gui.addFolder("AnimationMixer")
        mixerFolder.add(controls, "time").listen()
        mixerFolder.add(controls, "timeScale", 0, 5).onChange(function (timeScale) { mixer.timeScale = timeScale });
        mixerFolder.add(controls, "stopAllAction").listen()
        const actionFolder = gui.addFolder("AnimationAction")
        actionFolder.add(clipAction, "clampWhenFinished").listen();
        actionFolder.add(clipAction, "enabled").listen();
        actionFolder.add(clipAction, "paused").listen();
        actionFolder.add(clipAction, "loop", { LoopRepeat: THREE.LoopRepeat, LoopOnce: THREE.LoopOnce, LoopPingPong: THREE.LoopPingPong }).onChange(function (e) {
          if (e === THREE.LoopOnce || e === THREE.LoopPingPong) {
            clipAction.reset();
            clipAction.repetitions = undefined
            clipAction.setLoop(parseInt(e), undefined);
            console.log(clipAction)
          } else {
            clipAction.setLoop(parseInt(e), controls.repetitions);
          }
        });
        actionFolder.add(controls, "repetitions", 0, 100).listen().onChange(function (e) {
          if (clipAction.loop === THREE.LoopOnce || clipAction.loop === THREE.LoopPingPong) {
            clipAction.reset();
            clipAction.repetitions = undefined
            clipAction.setLoop(parseInt(clipAction.loop), undefined);
          } else {
            clipAction.setLoop(parseInt(e), controls.repetitions);
          }
        });
        actionFolder.add(clipAction, "time", 0, animationClip.duration, 0.001).listen()
        actionFolder.add(clipAction, "timeScale", 0, 5, 0.1).listen()
        actionFolder.add(clipAction, "weight", 0, 1, 0.01).listen()
        actionFolder.add(controls, "effectiveWeight", 0, 1, 0.01).listen()
        actionFolder.add(controls, "effectiveTimeScale", 0, 5, 0.01).listen()
        actionFolder.add(clipAction, "zeroSlopeAtEnd").listen()
        actionFolder.add(clipAction, "zeroSlopeAtStart").listen()
        actionFolder.add(clipAction, "stop")
        actionFolder.add(clipAction, "play")
        actionFolder.add(clipAction, "reset")
        actionFolder.add(controls, "warpStartTimeScale", 0, 10, 0.01)
        actionFolder.add(controls, "warpEndTimeScale", 0, 10, 0.01)
        actionFolder.add(controls, "warpDurationInSeconds", 0, 10, 0.01)
        actionFolder.add(controls, "warp")
        actionFolder.add(controls, "fadeDurationInSeconds", 0, 10, 0.01)
        actionFolder.add(controls, "fadeIn")
        actionFolder.add(controls, "fadeOut")

        gui.add(controls, "keyframe", 0, 15).step(1).onChange(function (frame) { showFrame(frame); });
      }

      const loader = new LegacyJSONLoader();
      loader.load(`${process.env.PUBLIC_URL}/models/horse/horse.js`, function (geometry, mat) {
        geometry.computeVertexNormals();
        geometry.computeMorphNormals();

        const material = new THREE.MeshLambertMaterial({ morphTargets: true, vertexColors: true });
        mesh = new THREE.Mesh(new THREE.BufferGeometry().fromGeometry(geometry), material);
        mesh.scale.set(0.15, 0.15, 0.15);
        mesh.translateY(-10);
        mesh.translateX(10);

        mixer = new THREE.AnimationMixer(mesh);
        // or create a custom clip from the set of morphtargets
        // var clip = THREE.AnimationClip.CreateFromMorphTargetSequence( 'gallop', geometry.morphTargets, 30 );
        animationClip = geometry.animations[0]
        clipAction = mixer.clipAction(animationClip).play();

        clipAction.setLoop(THREE.LoopRepeat);
        scene.add(mesh)

        // enable the controls
        enableControls()
      })

      const render = (): void => {
        var delta = clock.getDelta();
        trackballControls.update();
        requestAnimationFrame(render);
        renderer.render(scene, camera)

        if (mixer && clipAction) {
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
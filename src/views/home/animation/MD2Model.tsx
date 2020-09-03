/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-09-03 17:39:25
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-09-03 18:32:49
 * @Description: 雷神之锤模型加载动画
 */
import React, { useRef, useEffect, ReactElement } from "react";
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { MD2Loader } from 'three/examples/jsm/loaders/MD2Loader';
import {
  initRenderer,
  initCamera,
  initDefaultLighting,
  initTrackballControls
} from '../../../util/util.js';
import { addClipActionFolder } from '../../../util/animationUtil';

export default function MD2Model(props: any): ReactElement {

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
      let clipAction1:any;
      let clipAction2:any;
      let clipAction3:any;
      let animationClip1:any;
      let animationClip2:any;
      let animationClip3:any;
      let selectedClipAction:any;

      let mesh:any;
      let controls1:any;
      let controls2:any;
      let controls3:any;


      // control which keyframe to show
      const mixerControls = {
        time: 0,
        timeScale: 1,
        stopAllAction: function () { mixer.stopAllAction() },
      }



      const enableControls = (geometry:any) => {
        const mixerFolder = gui.addFolder("AnimationMixer")
        mixerFolder.add(mixerControls, "time").listen()
        mixerFolder.add(mixerControls, "timeScale", 0, 5).onChange(function (timeScale) { mixer.timeScale = timeScale });
        mixerFolder.add(mixerControls, "stopAllAction").listen()

        controls1 = addClipActionFolder("ClipAction 1", gui, clipAction1, animationClip1);
        controls2 = addClipActionFolder("ClipAction 2", gui, clipAction2, animationClip2);
        controls3 = addClipActionFolder("ClipAction 3", gui, clipAction3, animationClip3);

        const animationsArray = geometry.animations.map(function (e:any) {
          return e.name;
        });
        animationsArray.push("none")
        const animationMap = geometry.animations.reduce(function (res:any, el:any) {
          res[el.name] = el
          return res;
        }, { "none": undefined });

        gui.add({ animation: "none" }, "animation", animationsArray).onChange(function (selection) {
          clipAction1.stop();
          clipAction2.stop();
          clipAction3.stop();

          if (selectedClipAction) selectedClipAction.stop();
          if (selection !== "none") {
            selectedClipAction = mixer.clipAction(animationMap[selection]).play();
          }
        });
      }

      const loader = new MD2Loader();
      loader.load(`${process.env.PUBLIC_URL}/models/ogre/ogro.md2`, function (result: any) {

        new THREE.TextureLoader().load(`${process.env.PUBLIC_URL}/models/ogre/skins/skin.jpg`, texture => {
          let mat = new THREE.MeshStandardMaterial(
            {
              morphTargets: true,
              color: 0xffffff,
              metalness: 0,
              map: texture
            })
            
          mesh = new THREE.Mesh(result, mat);
          scene.add(mesh);

          // // setup the mixer
          mixer = new THREE.AnimationMixer(mesh);
          animationClip1 = result.animations[7];
          clipAction1 = mixer.clipAction(animationClip1).play();
          animationClip2 = result.animations[9];
          clipAction2 = mixer.clipAction(animationClip2);
          animationClip3 = result.animations[10];
          clipAction3 = mixer.clipAction(animationClip3);

          // add the animation controls
          enableControls(result);
        })

        
      });

      const render = (): void => {
        const delta = clock.getDelta();
        trackballControls.update();
        requestAnimationFrame(render);
        renderer.render(scene, camera)

        if (mixer && clipAction1 && controls1) {
          mixer.update(delta);
          controls1.time = mixer.time;
          controls1.effectiveTimeScale = clipAction1.getEffectiveTimeScale();
          controls1.effectiveWeight = clipAction1.getEffectiveWeight();

          controls2.time = mixer.time;
          controls2.effectiveTimeScale = clipAction2.getEffectiveTimeScale();
          controls2.effectiveWeight = clipAction2.getEffectiveWeight();

          controls3.time = mixer.time;
          controls3.effectiveTimeScale = clipAction3.getEffectiveTimeScale();
          controls3.effectiveWeight = clipAction3.getEffectiveWeight();

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


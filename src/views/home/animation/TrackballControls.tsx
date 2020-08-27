/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-27 19:32:52
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-27 19:57:02
 * @Description: 轨迹球控制器
 */
import React, { useRef, useEffect, ReactElement } from "react";
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import chroma from 'chroma-js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { initCamera, initRenderer, initDefaultLighting } from '../../../util/util.js';

export default function TrackballControl(props: any): ReactElement {

  const wrapRef = useRef(null);
  useEffect(() => {
    let animationId: number | null = null;
    if (wrapRef.current) {
      const wrap = wrapRef.current;
      // init renderer
      const renderer = initRenderer(wrap, undefined);
      // init camera
      const camera = initCamera(wrap, undefined);

      const scene = new THREE.Scene();

      initDefaultLighting(scene);

      const trackballControls = new TrackballControls(camera, renderer.domElement);
      trackballControls.rotateSpeed = 1.0;
      trackballControls.zoomSpeed = 1.0;
      trackballControls.panSpeed = 1.0;

      const loader = new OBJLoader();

      const setRandomColors = (object: any, scale: any) => {
        const children = object.children;
        if (children && children.length > 0) {
          children.forEach(function (e: any) {
            setRandomColors(e, scale)
          });
        } else {
          // no children assume contains a mesh
          if (object instanceof THREE.Mesh) {
            if (object.material instanceof Array) {
              object.material.forEach(function (m) {
                m.color = new THREE.Color(scale(Math.random()).hex());
                if (m.name.indexOf("building") === 0) {
                  m.emissive = new THREE.Color(0x444444);
                  m.transparent = true;
                  m.opacity = 0.8;
                }
              });
            } else {
              object.material.color = new THREE.Color(scale(Math.random()).hex());
              if (object.material.name.indexOf("building") === 0) {
                object.material.emissive = new THREE.Color(0x444444);
                object.material.transparent = true;
                object.material.opacity = 0.8;
              }
            }
          }
        }
      }

      loader.load(`${process.env.PUBLIC_URL}/models/city/city.obj`, function (object) {

        const scale = chroma.scale(['red', 'green', 'blue']);
        setRandomColors(object, scale);
        const mesh = object;
        scene.add(mesh);

      },
        undefined,
        (e) => {
          console.log(e)
        }
      );

      const render = () => {
        trackballControls.update();
        requestAnimationFrame(render);
        renderer.render(scene, camera)
      }
      render();

    }
    return () => {
      animationId && cancelAnimationFrame(animationId);
    }
  }, []);

  return <div ref={wrapRef} className="gl-wrapper"></div>;

}


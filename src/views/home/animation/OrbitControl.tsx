/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-31 15:59:36
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-31 17:19:58
 * @Description: 轨道控制器
 */
import React, { useRef, useEffect, ReactElement } from "react";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { initCamera, initRenderer } from '../../../util/util.js';
import { Texture } from 'three';

export default function OrbitControl(props: any): ReactElement {

  const wrapRef = useRef(null);
  useEffect(() => {
    let animationId: number | null = null;
    if (wrapRef.current) {
      const wrap: any = wrapRef.current;
      // init renderer
      const renderer = initRenderer(wrap, undefined);
      // init camera
      const camera = initCamera(wrap, undefined);
      const scene = new THREE.Scene();

      // Don't use the default lights, since that's a spotlight
      scene.add(new THREE.AmbientLight(0x222222));
      const dirLight = new THREE.DirectionalLight(0xffffff);
      dirLight.position.set(50, 10, 0);
      scene.add(dirLight);

      const orbitControls = new OrbitControls(camera, renderer.domElement);
      orbitControls.autoRotate = true;
      const planetPromise = new Promise((resolve: (value: Texture) => void, reject) => {

        new THREE.TextureLoader().load(`${process.env.PUBLIC_URL}/textures/mars/mars_1k_color.jpg`, texture => {
          resolve(texture)
        })

      })

      const normalPromise = new Promise((resolve: (value: Texture) => void, reject) => {

        new THREE.TextureLoader().load(`${process.env.PUBLIC_URL}/textures/mars/mars_1k_normal.jpg`, texture => {
          resolve(texture)
        })

      })

      Promise.all([planetPromise, normalPromise]).then(res => {
        const [planetTexture, normalTexture] = res;
        const planetMaterial = new THREE.MeshLambertMaterial({ map: planetTexture });
        scene.add(new THREE.Mesh(new THREE.SphereGeometry(20, 40, 40), planetMaterial))
      }).catch(err => {
        console.log(err)
      })

      const render = () => {
        orbitControls.update();
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


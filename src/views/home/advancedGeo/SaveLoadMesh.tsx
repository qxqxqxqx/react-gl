/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-15 10:23:22
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-21 18:21:13
 * @Description: 保存mesh json & load json
 */
import React, { useRef, useEffect, ReactElement } from "react";
import * as THREE from 'three';
import * as dat from 'dat.gui';
import {
  initRenderer,
  initCamera,
} from '../../../util/util.js';

export default function SaveLoadMesh(props: any): ReactElement {

  const wrapRef = useRef(null);
  useEffect(() => {
    const gui = new dat.GUI();
    let animationId: number | null = null;
    if (wrapRef.current) {
      const wrap = wrapRef.current;
      // init renderer
      const renderer = initRenderer(wrap, undefined);
      // init camera
      const camera = initCamera(wrap, new THREE.Vector3(0, 40, 50));
      // init scene
      const scene = new THREE.Scene();
      // camera.lookAt(scene.position);

      const createMesh = (geom: THREE.TorusKnotGeometry): THREE.Mesh => {

        // assign two materials
        const meshMaterial = new THREE.MeshBasicMaterial({
          // vertexColors: THREE.VertexColors,
          wireframe: true,
          wireframeLinewidth: 2,
          color: 0xaaaaaa
        });
        meshMaterial.side = THREE.DoubleSide;

        // create a multimaterial
        var mesh = new THREE.Mesh(geom, meshMaterial);
        mesh.position.set(20, 0, 0)

        return mesh;
      }

      let knot: any = createMesh(new THREE.TorusKnotGeometry(10, 1, 64, 8, 2, 3));
      // add the sphere to the scene
      scene.add(knot);

      let step = 0;
      let loadedMesh:any;

      interface Controls {
        // members of your "class" go here
        radius: number,
        tube: number,
        radialSegments: number,
        tubularSegments: number,
        p: number,
        q: number,
        redraw: () => void,
        save: () => void,
        load: () => void
      }

      const Controls = function (this: Controls) {

        // we need the first child, since it's a multimaterial
        this.radius = knot.geometry.parameters.radius;
        this.tube = 0.3;
        this.radialSegments = knot.geometry.parameters.radialSegments;
        this.tubularSegments = knot.geometry.parameters.tubularSegments;
        this.p = knot.geometry.parameters.p;
        this.q = knot.geometry.parameters.q;

        this.redraw = function () {
          // remove the old plane
          scene.remove(knot);
          // create a new one
          knot = createMesh(
            new THREE.TorusKnotGeometry(
              controls.radius,
              controls.tube,
              Math.round(controls.radialSegments),
              Math.round(controls.tubularSegments),
              Math.round(controls.p),
              Math.round(controls.q)
            )
          );
          // add it to the scene.
          scene.add(knot);
        };

        this.save = function () {
          const result = knot.toJSON();
          localStorage.setItem("json", JSON.stringify(result));
          console.log(localStorage.getItem("json"));
        };

        this.load = function () {

          scene.remove(loadedMesh);

          const json = localStorage.getItem("json");

          if (json) {
            const loadedGeometry = JSON.parse(json);
            const loader = new THREE.ObjectLoader();
            loadedMesh = loader.parse(loadedGeometry);
            loadedMesh.position.x -= 40;
            scene.add(loadedMesh);
          }
        }
      } as any as { new(): Controls; };;
      const controls = new Controls();
      const ioGui = gui.addFolder('Save & Load');
      ioGui.add(controls, 'save').onChange(controls.save);
      ioGui.add(controls, 'load').onChange(controls.load);
      const meshGui = gui.addFolder('mesh');
      meshGui.add(controls, 'radius', 0, 40).onChange(controls.redraw);
      meshGui.add(controls, 'tube', 0, 40).onChange(controls.redraw);
      meshGui.add(controls, 'radialSegments', 0, 400).step(1).onChange(controls.redraw);
      meshGui.add(controls, 'tubularSegments', 1, 20).step(1).onChange(controls.redraw);
      meshGui.add(controls, 'p', 1, 10).step(1).onChange(controls.redraw);
      meshGui.add(controls, 'q', 1, 15).step(1).onChange(controls.redraw);
      
      const render = (): void => {
        knot.rotation.y = step += 0.01;
        // render using requestAnimationFrame
        animationId = requestAnimationFrame(render);
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

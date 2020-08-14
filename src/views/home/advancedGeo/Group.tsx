/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-13 14:35:48
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-13 16:46:54
 * @Description: 网格组合
 */
import React, { useRef, useEffect, ReactElement } from "react";
import * as THREE from 'three';
import * as dat from 'dat.gui';
import {
  initRenderer,
  initCamera,
  initDefaultLighting,
  addLargeGroundPlane
} from '../../../util/util.js';

export default function Group(props: any): ReactElement {

  const wrapRef = useRef(null);
  useEffect(() => {
    const gui = new dat.GUI();
    if (wrapRef.current) {
      const wrap = wrapRef.current;
      // init renderer
      const renderer = initRenderer(wrap, undefined);
      // init camera
      const camera = initCamera(wrap, new THREE.Vector3(30, 30, 30));
      // init scene
      const scene = new THREE.Scene();
      initDefaultLighting(scene, undefined);
      const groundPlane = addLargeGroundPlane(scene, undefined);
      groundPlane.position.y = 0;

      let sphere:any;
      let cube:any;
      let group: THREE.Group;
      let bboxMesh: THREE.Mesh;
      let arrow: THREE.ArrowHelper;

      const createMesh =(geom: THREE.Geometry)=> {

        // assign two materials
        const meshMaterial = new THREE.MeshNormalMaterial();
        meshMaterial.side = THREE.DoubleSide;

        // create a multimaterial
        const plane = new THREE.Mesh(geom, meshMaterial);

        return plane;
      }

      // http://jsfiddle.net/MREL4/
      const setFromObject = (object: THREE.Group): THREE.Box3 => {
        const box = new THREE.Box3();
        const v1 = new THREE.Vector3();
        object.updateMatrixWorld(true);
        box.makeEmpty();
        object.traverse(function (node:any) {
          if (node.geometry !== undefined && node.geometry.vertices !== undefined) {
            const vertices = node.geometry.vertices;
            for (let i = 0, il = vertices.length; i < il; i++) {
              v1.copy(vertices[i]);
              v1.applyMatrix4(node.matrixWorld);
              box.expandByPoint(v1);
            }
          }
        });
        return box;
      }

      interface Controls {
        // members of your "class" go here
        cubePosX: number,
        cubePosY: number,
        cubePosZ: number,

        spherePosX: number,
        spherePosY: number,
        spherePosZ: number,

        groupPosX: number,
        groupPosY: number,
        groupPosZ: number,

        grouping: boolean,
        rotate: boolean,

        groupScale: number,
        cubeScale: number,
        sphereScale: number,
        redraw: () => void,
        positionBoundingBox: () => void
      }

      const Controls = function (this: Controls) {

        // the start geometry and material. Used as the base for the settings in the control UI
        this.cubePosX = 0;
        this.cubePosY = 3;
        this.cubePosZ = 10;

        this.spherePosX = 10;
        this.spherePosY = 5;
        this.spherePosZ = 0;

        this.groupPosX = 10;
        this.groupPosY = 5;
        this.groupPosZ = 0;

        this.grouping = false;
        this.rotate = false;

        this.groupScale = 1;
        this.cubeScale = 1;
        this.sphereScale = 1;

        this.redraw = function () {
          // remove the old plane
          scene.remove(group);

          // create a new one
          sphere = createMesh(new THREE.SphereGeometry(5, 10, 10));
          cube = createMesh(new THREE.BoxGeometry(6, 6, 6));

          sphere.position.set(controls.spherePosX, controls.spherePosY, controls.spherePosZ);
          sphere.scale.set(controls.sphereScale, controls.sphereScale, controls.sphereScale);
          cube.position.set(controls.cubePosX, controls.cubePosY, controls.cubePosZ);
          cube.scale.set(controls.cubeScale, controls.cubeScale, controls.cubeScale);

          // also create a group, only used for rotating
          group = new THREE.Group();
          group.position.set(controls.groupPosX, controls.groupPosY, controls.groupPosZ);
          group.scale.set(controls.groupScale, controls.groupScale, controls.groupScale);
          group.add(sphere);
          group.add(cube);

          scene.add(group);
          controls.positionBoundingBox();

          if (arrow) scene.remove(arrow)
          arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), group.position, 10, 0x0000ff);
          scene.add(arrow);
        }

        this.positionBoundingBox = function () {
          scene.remove(bboxMesh);
          const box = setFromObject(group);
          const width = box.max.x - box.min.x;
          const height = box.max.y - box.min.y;
          const depth = box.max.z - box.min.z;

          const bbox = new THREE.BoxGeometry(width, height, depth);
          bboxMesh = new THREE.Mesh(bbox, new THREE.MeshBasicMaterial({
            color: 0x000000,
            // vertexColors: THREE.VertexColors,
            wireframeLinewidth: 2,
            wireframe: true
          }));

          // scene.add(bboxMesh);

          bboxMesh.position.x = ((box.min.x + box.max.x) / 2);
          bboxMesh.position.y = ((box.min.y + box.max.y) / 2);
          bboxMesh.position.z = ((box.min.z + box.max.z) / 2);
        }
      } as any as { new(): Controls; };;
      const controls = new Controls();
      const sphereFolder = gui.addFolder("sphere");
      sphereFolder.add(controls, "spherePosX", -20, 20).onChange(function (e) {
        sphere.position.x = e;
        controls.positionBoundingBox()
        controls.redraw();
      });
      sphereFolder.add(controls, "spherePosZ", -20, 20).onChange(function (e) {
        sphere.position.z = e;
        controls.positionBoundingBox();
        controls.redraw();
      });
      sphereFolder.add(controls, "spherePosY", -20, 20).onChange(function (e) {
        sphere.position.y = e;
        controls.positionBoundingBox();
        controls.redraw();
      });
      sphereFolder.add(controls, "sphereScale", 0, 3).onChange(function (e) {
        sphere.scale.set(e, e, e);
        controls.positionBoundingBox();
        controls.redraw();
      });

      const cubeFolder = gui.addFolder("cube");
      cubeFolder.add(controls, "cubePosX", -20, 20).onChange(function (e) {
        cube.position.x = e;
        controls.positionBoundingBox();
        controls.redraw();
      });
      cubeFolder.add(controls, "cubePosZ", -20, 20).onChange(function (e) {
        cube.position.z = e;
        controls.positionBoundingBox();
        controls.redraw();
      });
      cubeFolder.add(controls, "cubePosY", -20, 20).onChange(function (e) {
        cube.position.y = e;
        controls.positionBoundingBox();
        controls.redraw();
      });
      cubeFolder.add(controls, "cubeScale", 0, 3).onChange(function (e) {
        cube.scale.set(e, e, e);
        controls.positionBoundingBox();
        controls.redraw();
      });

      const groupFolder = gui.addFolder("group");
      groupFolder.add(controls, "groupPosX", -20, 20).onChange(function (e) {
        group.position.x = e;
        controls.positionBoundingBox();
        controls.redraw();
      });
      groupFolder.add(controls, "groupPosZ", -20, 20).onChange(function (e) {
        group.position.z = e;
        controls.positionBoundingBox();
        controls.redraw();
      });
      groupFolder.add(controls, "groupPosY", -20, 20).onChange(function (e) {
        group.position.y = e;
        controls.positionBoundingBox();
        controls.redraw();
      });
      groupFolder.add(controls, "groupScale", 0, 3).onChange(function (e) {
        group.scale.set(e, e, e);
        controls.positionBoundingBox();
        controls.redraw();
      });

      gui.add(controls, "grouping");
      gui.add(controls, "rotate");
      controls.redraw();

      let step = 0.03;

      const render = (): void => {
        if (controls.grouping && controls.rotate) {
          group.rotation.y += step;
        }

        if (controls.rotate && !controls.grouping) {
          sphere.rotation.y += step;
          cube.rotation.y += step;
        }
        requestAnimationFrame(render);
        renderer.render(scene, camera);
      }
      render();
    }
    return () => {
      gui.destroy()
    }
  }, []);

  return <div ref={wrapRef} className="gl-wrapper"></div>;

}

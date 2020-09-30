/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-06 17:07:22
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-21 17:13:05
 * @Description: 三维几何体之间结合成新的几何体
 */
import React, { Component } from "react";
import * as THREE from 'three';
import {
  initRenderer,
  initCamera,
  addLargeGroundPlane,
  initDefaultLighting,
  applyMeshNormalMaterial
} from '../../../util/util';
import '../../../util/ThreeBSP';
import redrawResult from './bspHelper';
import { IRHoc } from '../../../component/class/IRHoc';
@IRHoc
export default class ThreeBSP extends Component<any, any> {
  private wrapRef: React.RefObject<HTMLDivElement>;
  public constructor(props: any) {
    super(props);
    this.wrapRef = React.createRef<HTMLDivElement>();
  }

  public componentDidMount() {
    this.init();
  }

  /**
   * init
   */
  public init() {
    const { gui, changeAnimationId } = this.props;
    if (this.wrapRef.current) {
      const wrap: HTMLDivElement = this.wrapRef.current;
      // init renderer
      const renderer = initRenderer(wrap, undefined);
      // init camera
      const camera = initCamera(wrap, undefined);
      // init scene
      const scene = new THREE.Scene();
      // add axes helper
      const axes = new THREE.AxesHelper(20);
      scene.add(axes);
      // add ground plane
      const groundPlane = addLargeGroundPlane(scene, undefined);
      groundPlane.position.y = -30;
      // add light
      initDefaultLighting(scene, undefined);

      const createMesh = (geom: THREE.Geometry): THREE.Mesh => {
        // assign two materials
        const meshMaterial = new THREE.MeshNormalMaterial();
        meshMaterial.side = THREE.DoubleSide;
        const wireFrameMat = new THREE.MeshBasicMaterial({
          // transparency: true,
          opacity: 0.5,
          wireframeLinewidth: 0.5
        });
        wireFrameMat.wireframe = true;
        // create a multimaterial
        const mesh = new THREE.Mesh(geom, wireFrameMat);
        return mesh;
      }

      const sphere1: any = createMesh(new THREE.SphereGeometry(5, 20, 30));
      sphere1.position.x = -2;
      const sphere2: any = createMesh(new THREE.SphereGeometry(5, 20, 30));
      sphere2.position.set(3, 0, 0);
      const cube: any = createMesh(new THREE.BoxGeometry(5, 5, 5));
      cube.position.x = -7;

      // add the sphere to the scene
      scene.add(sphere1);
      scene.add(sphere2);
      scene.add(cube);

      // position and point the camera to the center of the scene
      camera.position.x = 0;
      camera.position.y = 20;
      camera.position.z = 20;
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      let result: any;

      interface Controls {
        // members of your "class" go here
        sphere1PosX: number,
        sphere1PosY: number,
        sphere1PosZ: number,
        sphere1Scale: number,

        sphere2PosX: number,
        sphere2PosY: number,
        sphere2PosZ: number,
        sphere2Scale: number,

        cubePosX: number;
        cubePosY: number;
        cubePosZ: number;
        scaleX: number;
        scaleY: number;
        scaleZ: number;

        actionCube: string,
        actionSphere: string,
        hideWireframes: boolean,
        rotateResult: boolean
        appliedMaterial: typeof applyMeshNormalMaterial,
        showResult: () => void,
        mesh: any
      }
      const Controls = function (this: Controls) {

        this.sphere1PosX = sphere1.position.x;
        this.sphere1PosY = sphere1.position.y;
        this.sphere1PosZ = sphere1.position.z;
        this.sphere1Scale = 1;

        this.sphere2PosX = sphere2.position.x;
        this.sphere2PosY = sphere2.position.y;
        this.sphere2PosZ = sphere2.position.z;
        this.sphere2Scale = 1;

        this.cubePosX = cube.position.x;
        this.cubePosY = cube.position.y;
        this.cubePosZ = cube.position.z;
        this.scaleX = 1;
        this.scaleY = 1;
        this.scaleZ = 1;

        this.actionCube = "subtract"; // add, substract, intersect
        this.actionSphere = "subtract";

        this.showResult = function () {
          setTimeout(() => {
            result = redrawResult(result, sphere1, sphere2, cube, controls, scene);
          }, 200);

        };

        this.hideWireframes = false;
        this.rotateResult = false;
      } as any as { new(): Controls; };;
      const controls = new Controls();

      const guiSphere1 = gui.addFolder("Sphere1");
      guiSphere1.add(controls, "sphere1PosX", -15, 15).onChange(function () {
        sphere1.position.set(controls.sphere1PosX, controls.sphere1PosY, controls.sphere1PosZ)
      });
      guiSphere1.add(controls, "sphere1PosY", -15, 15).onChange(function () {
        sphere1.position.set(controls.sphere1PosX, controls.sphere1PosY, controls.sphere1PosZ)
      });
      guiSphere1.add(controls, "sphere1PosZ", -15, 15).onChange(function () {
        sphere1.position.set(controls.sphere1PosX, controls.sphere1PosY, controls.sphere1PosZ)
      });
      guiSphere1.add(controls, "sphere1Scale", 0, 10).onChange(function (e: any) {
        sphere1.scale.set(e, e, e)
      });

      const guiSphere2 = gui.addFolder("Sphere2");
      guiSphere2.add(controls, "sphere2PosX", -15, 15).onChange(function () {
        sphere2.position.set(controls.sphere2PosX, controls.sphere2PosY, controls.sphere2PosZ)
      });
      guiSphere2.add(controls, "sphere2PosY", -15, 15).onChange(function () {
        sphere2.position.set(controls.sphere2PosX, controls.sphere2PosY, controls.sphere2PosZ)
      });
      guiSphere2.add(controls, "sphere2PosZ", -15, 15).onChange(function () {
        sphere2.position.set(controls.sphere2PosX, controls.sphere2PosY, controls.sphere2PosZ)
      });
      guiSphere2.add(controls, "sphere2Scale", 0, 10).onChange(function (e: any) {
        sphere2.scale.set(e, e, e)
      });
      guiSphere2.add(controls, "actionSphere", ["subtract", "intersect", "union", "none"]);

      const guiCube = gui.addFolder("cube");
      guiCube.add(controls, "cubePosX", -15, 15).onChange(function () {
        cube.position.set(controls.cubePosX, controls.cubePosY, controls.cubePosZ)
      });
      guiCube.add(controls, "cubePosY", -15, 15).onChange(function () {
        cube.position.set(controls.cubePosX, controls.cubePosY, controls.cubePosZ)
      });
      guiCube.add(controls, "cubePosZ", -15, 15).onChange(function () {
        cube.position.set(controls.cubePosX, controls.cubePosY, controls.cubePosZ)
      });
      guiCube.add(controls, "scaleX", 0, 10).onChange(function (e: any) {
        cube.scale.x = e
      });
      guiCube.add(controls, "scaleY", 0, 10).onChange(function (e: any) {
        cube.scale.y = e
      });
      guiCube.add(controls, "scaleZ", 0, 10).onChange(function (e: any) {
        cube.scale.z = e
      });
      guiCube.add(controls, "actionCube", ["subtract", "intersect", "union", "none"]);

      gui.add(controls, "showResult");
      gui.add(controls, "rotateResult");
      gui.add(controls, "hideWireframes").onChange(function () {
        if (controls.hideWireframes) {
          console.log('-')
          sphere1.material.visible = false;
          sphere2.material.visible = false;
          cube.material.visible = false;
        } else {
          sphere1.material.visible = true;
          sphere2.material.visible = true;
          cube.material.visible = true;
        }
      });

      // render and animation
      const render = () => {
        if (controls.rotateResult && result) {
          result.rotation.y += 0.04;
          //      result.rotation.x+=0.04;
          result.rotation.z -= 0.005;
        }
        const animationId = requestAnimationFrame(render);
        changeAnimationId(animationId);
        renderer.render(scene, camera);
      }
      render();
    }


  }

  render() {
    return <div ref={this.wrapRef} className="gl-wrapper"></div>;
  }
}


/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-05 17:00:38
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-21 17:02:03
 * @Description: 二维图形沿z轴拉伸成三维
 */
import React, { Component } from "react";
import * as THREE from 'three';
import {
  initRenderer,
  initCamera, addLargeGroundPlane,
  initDefaultLighting,
  applyMeshNormalMaterial,
  applyMeshStandardMaterial,
  redrawGeometryAndUpdateUI
} from '../../../util/util.js';
import { IRHoc } from '../../../component/class/IRHoc';
@IRHoc
export default class ExtrudeGeometry extends Component<any, any> {
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
      const drawShape = (): THREE.Shape => {

        // create a basic shape
        const shape = new THREE.Shape();
        // startpoint
        shape.moveTo(10, 10);
        // straight line upwards
        shape.lineTo(10, 40);
        // the top of the figure, curve to the right
        shape.bezierCurveTo(15, 25, 25, 25, 30, 40);
        // spline back down
        shape.splineThru(
          [new THREE.Vector2(32, 30),
          new THREE.Vector2(28, 20),
          new THREE.Vector2(30, 10),
          ]);
        // curve at the bottom
        shape.quadraticCurveTo(20, 15, 10, 10);
        // add 'eye' hole one
        const hole1 = new THREE.Path();
        hole1.absellipse(16, 24, 2, 3, 0, Math.PI * 2, true, 0);
        shape.holes.push(hole1);
        // add 'eye hole 2'
        const hole2 = new THREE.Path();
        hole2.absellipse(23, 24, 2, 3, 0, Math.PI * 2, true, 0);
        shape.holes.push(hole2);
        // add 'mouth'
        const hole3 = new THREE.Path();
        hole3.absarc(20, 16, 2, 0, Math.PI, true);
        shape.holes.push(hole3);

        // return the shape
        return shape;
      }

      interface Controls {
        // members of your "class" go here
        castShadow: boolean,
        groundPlaneVisible: boolean,
        depth: number,
        bevelThickness: number,
        bevelSize: number,
        bevelSegments: number,
        bevelEnabled: boolean,
        curveSegments: number,
        steps: number,
        appliedMaterial: typeof applyMeshNormalMaterial,
        redraw: any,
        mesh: any
      }

      const Controls = function (this: Controls) {
        // the start geometry and material. Used as the base for the settings in the control UI
        this.appliedMaterial = applyMeshNormalMaterial
        this.castShadow = true;
        this.groundPlaneVisible = true;
        this.depth = 2;
        this.bevelThickness = 2;
        this.bevelSize = 0.5;
        this.bevelEnabled = true;
        this.bevelSegments = 3;
        this.bevelEnabled = true;
        this.curveSegments = 12;
        this.steps = 1;

        // redraw function, updates the control UI and recreates the geometry.
        this.redraw = function () {
          redrawGeometryAndUpdateUI(gui, scene, controls, function () {
            const options = {
              depth: controls.depth,
              bevelThickness: controls.bevelThickness,
              bevelSize: controls.bevelSize,
              bevelSegments: controls.bevelSegments,
              bevelEnabled: controls.bevelEnabled,
              curveSegments: controls.curveSegments,
              steps: controls.steps
            };
            const geom = new THREE.ExtrudeGeometry(drawShape(), options);
            geom.applyMatrix4(new THREE.Matrix4().makeTranslation(-20, 0, 0));
            geom.applyMatrix4(new THREE.Matrix4().makeScale(0.4, 0.4, 0.4));
            return geom
          });
        };
      } as any as { new(): Controls; };;
      const controls = new Controls();

      gui.add(controls, 'depth', 0, 20).onChange(controls.redraw);
      gui.add(controls, 'bevelThickness', 0, 10).onChange(controls.redraw);
      gui.add(controls, 'bevelSize', 0, 10).onChange(controls.redraw);
      gui.add(controls, 'bevelSegments', 0, 30).step(1).onChange(controls.redraw);
      gui.add(controls, 'bevelEnabled').onChange(controls.redraw);
      gui.add(controls, 'curveSegments', 1, 30).step(1).onChange(controls.redraw);
      gui.add(controls, 'steps', 1, 5).step(1).onChange(controls.redraw);
      // add a material section, so we can switch between materials
      gui.add(controls, 'appliedMaterial', {
        meshNormal: applyMeshNormalMaterial,
        meshStandard: applyMeshStandardMaterial
      }).onChange(controls.redraw)
      gui.add(controls, 'castShadow').onChange(function (e: any) { controls.mesh.castShadow = e })
      gui.add(controls, 'groundPlaneVisible').onChange(function (e: any) { groundPlane.material.visible = e })
      // initialize the first redraw so everything gets initialized
      controls.redraw();
      // render and animation
      let step = 0;
      const render = () => {
        controls.mesh.rotation.y = step += 0.005
        controls.mesh.rotation.x = step
        controls.mesh.rotation.z = step
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



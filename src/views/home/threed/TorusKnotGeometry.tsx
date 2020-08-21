/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-05 13:37:34
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-21 16:52:35
 * @Description: 环状纽结
 */
import React, { Component } from "react";
import * as THREE from 'three';
import {
  initRenderer,
  initCamera,
  addLargeGroundPlane,
  initDefaultLighting,
  applyMeshNormalMaterial,
  applyMeshStandardMaterial,
  redrawGeometryAndUpdateUI
} from '../../../util/util.js';
import { IRHoc } from '../../../component/class/IRHoc';
@IRHoc
export default class TorusKnotGeometry extends Component<any, any> {
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
      // const axes = new THREE.AxesHelper(20);
      // scene.add(axes);
      // add ground plane
      const groundPlane = addLargeGroundPlane(scene, undefined);
      groundPlane.position.y = -50;
      // add light
      initDefaultLighting(scene, undefined);

      interface Controls {
        // members of your "class" go here
        castShadow: boolean,
        groundPlaneVisible: boolean,

        radius: number,
        tube: number,
        radialSegments: number,
        tubularSegments: number,
        p: number,
        q: number,
        appliedMaterial: typeof applyMeshNormalMaterial,
        redraw: any,
        mesh: any
      }

      const Controls = function (this: Controls) {
        // the start geometry and material. Used as the base for the settings in the control UI
        this.appliedMaterial = applyMeshNormalMaterial
        this.castShadow = true;
        this.groundPlaneVisible = true;
        const baseGeom = new THREE.TorusKnotGeometry();
        this.radius = baseGeom.parameters.radius ? baseGeom.parameters.radius : 1;
        this.tube = 0.3;
        this.radialSegments = baseGeom.parameters.radialSegments ? baseGeom.parameters.radialSegments : 8;
        this.tubularSegments = baseGeom.parameters.tubularSegments ? baseGeom.parameters.tubularSegments : 64;
        this.p = 2;
        this.q = 3;
        // redraw function, updates the control UI and recreates the geometry.
        this.redraw = function () {
          redrawGeometryAndUpdateUI(gui, scene, controls, function () {
            return new THREE.TorusKnotGeometry(controls.radius, controls.tube, Math.round(
              controls.tubularSegments), Math.round(controls.radialSegments), Math.round(
                controls.p), Math.round(controls.q))
          });
        };
      } as any as { new(): Controls; };;
      const controls = new Controls();
      // create the GUI with the specific settings for this geometry

      gui.add(controls, 'radius', 0, 10).onChange(controls.redraw);
      gui.add(controls, 'tube', 0, 10).onChange(controls.redraw);
      gui.add(controls, 'radialSegments', 0, 400).step(1).onChange(controls.redraw);
      gui.add(controls, 'tubularSegments', 1, 200).step(1).onChange(controls.redraw);
      gui.add(controls, 'p', 1, 10).step(1).onChange(controls.redraw);
      gui.add(controls, 'q', 1, 15).step(1).onChange(controls.redraw);
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
        controls.mesh.rotation.y = step += 0.01
        controls.mesh.rotation.x = step
        controls.mesh.rotation.z = step
        const animationId = requestAnimationFrame(render);
        changeAnimationId(animationId)
        renderer.render(scene, camera);
      }
      render();
    }

  }

  render() {
    return <div ref={this.wrapRef} className="gl-wrapper"></div>;
  }
}

/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-05 13:56:29
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-21 16:54:57
 * @Description: 多面体
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
export default class PolyhedronGeometry extends Component<any, any> {
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
        detail: number,
        type: string,
        appliedMaterial: typeof applyMeshNormalMaterial,
        redraw: any,
        mesh: any
      }

      const Controls = function (this: Controls) {
        // the start geometry and material. Used as the base for the settings in the control UI
        this.appliedMaterial = applyMeshNormalMaterial
        this.castShadow = true;
        this.groundPlaneVisible = true;
        this.radius = 10;
        this.detail = 0;
        this.type = 'Icosahedron';
        // redraw function, updates the control UI and recreates the geometry.
        this.redraw = function () {
          redrawGeometryAndUpdateUI(gui, scene, controls, function () {
            var polyhedron;
            switch (controls.type) {
              case 'Icosahedron':
                polyhedron = new THREE.IcosahedronGeometry(controls.radius, controls.detail);
                break;
              case 'Tetrahedron':
                polyhedron = new THREE.TetrahedronGeometry(controls.radius, controls.detail);
                break;
              case 'Octahedron':
                polyhedron = new THREE.OctahedronGeometry(controls.radius, controls.detail);
                break;
              case 'Dodecahedron':
                polyhedron = new THREE.DodecahedronGeometry(controls.radius, controls.detail);
                break;
              case 'Custom':
                const vertices = [
                  1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1
                ];

                const indices = [
                  2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1
                ];

                polyhedron = new THREE.PolyhedronGeometry(vertices, indices, controls.radius, controls.detail);
                break;
            }

            return polyhedron
          });
        };
      } as any as { new(): Controls; };;
      const controls = new Controls();
      // create the GUI with the specific settings for this geometry

      gui.add(controls, 'radius', 0, 40).step(1).onChange(controls.redraw);
      gui.add(controls, 'detail', 0, 3).step(1).onChange(controls.redraw);
      gui.add(controls, 'type', ['Icosahedron', 'Tetrahedron', 'Octahedron', 'Dodecahedron', 'Custom']).onChange(controls.redraw);
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

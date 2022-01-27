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
export default class SphereGeometry extends Component<any, any> {
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
      groundPlane.position.y = -10;
      // add light
      initDefaultLighting(scene, undefined);

      interface Controls {
        // members of your "class" go here
        castShadow: boolean,
        groundPlaneVisible: boolean,
        radius: number,
        phiStart: number,
        phiLength: number,
        thetaStart: number,
        thetaLength: number,
        widthSegments: number,
        heightSegments: number,
        appliedMaterial: typeof applyMeshNormalMaterial,
        redraw: any,
        mesh: any
      }

      const Controls = function (this: Controls) {
        this.appliedMaterial = applyMeshNormalMaterial
        this.castShadow = true;
        this.groundPlaneVisible = true;
        const baseSphere = new THREE.SphereGeometry(4, 10, 10);
        this.radius = baseSphere.parameters.radius;
        this.widthSegments = baseSphere.parameters.widthSegments;
        this.heightSegments = baseSphere.parameters.heightSegments;
        this.phiStart = 0;
        this.phiLength = Math.PI * 2;
        this.thetaStart = 0;
        this.thetaLength = Math.PI;
        // redraw function, updates the control UI and recreates the geometry.
        this.redraw = function () {
          redrawGeometryAndUpdateUI(gui, scene, controls, function () {
            return new THREE.SphereGeometry(controls.radius, controls.widthSegments, controls.heightSegments,
              controls.phiStart, controls.phiLength, controls.thetaStart, controls.thetaLength);
          });
        };
      } as any as { new(): Controls; };;
      const controls = new Controls();
      // create the GUI with the specific settings for this geometry

      gui.add(controls, 'radius', 0, 40).onChange(controls.redraw);
      gui.add(controls, 'widthSegments', 0, 20).onChange(controls.redraw);
      gui.add(controls, 'heightSegments', 0, 20).onChange(controls.redraw);
      gui.add(controls, 'phiStart', 0, 2 * Math.PI).onChange(controls.redraw);
      gui.add(controls, 'phiLength', 0, 2 * Math.PI).onChange(controls.redraw);
      gui.add(controls, 'thetaStart', 0, 2 * Math.PI).onChange(controls.redraw);
      gui.add(controls, 'thetaLength', 0, 2 * Math.PI).onChange(controls.redraw);
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
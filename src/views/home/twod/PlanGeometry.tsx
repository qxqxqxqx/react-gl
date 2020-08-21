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
export default class PlanGeometry extends Component<any, any> {
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
    const { gui, changeAnimationId} = this.props;
    if (this.wrapRef.current) {
      const wrap: HTMLDivElement = this.wrapRef.current;
      const renderer = initRenderer(wrap, undefined);
      const camera = initCamera(wrap, undefined);
      const scene = new THREE.Scene();
      // const axes = new THREE.AxesHelper(20);
      // scene.add(axes);
      const groundPlane = addLargeGroundPlane(scene, undefined);
      groundPlane.position.y = -30;
      initDefaultLighting(scene, undefined);
      interface Controls {
        // members of your "class" go here
        castShadow: boolean,
        groundPlaneVisible: boolean,
        planeGeometry: THREE.PlaneGeometry,
        width: number,
        height: number,
        widthSegments: number,
        heightSegments: number,
        appliedMaterial: typeof applyMeshNormalMaterial,
        redraw: any,
        mesh: any
      }
      const Controls = function (this: Controls) {
        // the start geometry and material. Used as the base for the settings in the control UI
        this.appliedMaterial = applyMeshNormalMaterial
        this.castShadow = true;
        this.groundPlaneVisible = true;

        this.planeGeometry = new THREE.PlaneGeometry(20, 20, 4, 4);
        this.width = this.planeGeometry.parameters.width;
        this.height = this.planeGeometry.parameters.height;
        this.widthSegments = this.planeGeometry.parameters.widthSegments;
        this.heightSegments = this.planeGeometry.parameters.heightSegments;

        // redraw function, updates the control UI and recreates the geometry.
        this.redraw = function () {
          redrawGeometryAndUpdateUI(gui, scene, controls, function () {
            return new THREE.PlaneGeometry(controls.width, controls.height, Math.round(controls.widthSegments), Math.round(controls.heightSegments));
          });
        };
      } as any as { new(): Controls; };;
      const controls = new Controls();
      gui.add(controls, 'width', 0, 40).onChange(controls.redraw);
      gui.add(controls, 'height', 0, 40).onChange(controls.redraw);
      gui.add(controls, 'widthSegments', 0, 10).onChange(controls.redraw);
      gui.add(controls, 'heightSegments', 0, 10).onChange(controls.redraw);
      // add a material section, so we can switch between materials
      gui.add(controls, 'appliedMaterial', {
        meshNormal: applyMeshNormalMaterial,
        meshStandard: applyMeshStandardMaterial
      }).onChange(controls.redraw)

      gui.add(controls, 'castShadow').onChange(function (e:any) { controls.mesh.castShadow = e })
      gui.add(controls, 'groundPlaneVisible').onChange(function (e:any) { groundPlane.material.visible = e })
      // initialize the first redraw so everything gets initialized
      controls.redraw();
      let step = 0.1;
      const render = () => {
        controls.mesh.rotation.y = step += 0.01
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
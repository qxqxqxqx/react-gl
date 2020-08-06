/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-06 14:35:13
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-06 16:25:44
 * @Description: 三维文字
 */
import React, { Component } from "react";
import * as THREE from 'three';
import * as dat from 'dat.gui';
import {
  initRenderer,
  initCamera,
  addLargeGroundPlane,
  initDefaultLighting,
  applyMeshNormalMaterial,
  applyMeshStandardMaterial,
  redrawGeometryAndUpdateUI
} from '../../../util/util';
import font1 from '../../../assets/fonts/bitstream_vera_sans_mono_roman.typeface.json';
import font2 from '../../../assets/fonts/helvetiker_bold.typeface.json';
import font3 from '../../../assets/fonts/helvetiker_regular.typeface.json';

export default class TextGeometry extends Component<any, any> {
  private wrapRef: React.RefObject<HTMLDivElement>;
  private gui: dat.GUI;
  public constructor(props: any) {
    super(props);
    this.wrapRef = React.createRef<HTMLDivElement>();
    this.gui = new dat.GUI();
  }

  public componentDidMount() {
    this.init();
  }

  /**
   * remove gui
   */
  public componentWillUnmount() {
    this.gui.destroy()
  }

  /**
   * init
   */
  public init() {
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
      
      interface Controls {
        // members of your "class" go here
        castShadow: boolean,
        groundPlaneVisible: boolean,
        size: number,
        height: number,
        bevelThickness: number,
        bevelSize: number,
        bevelSegments: number,
        bevelEnabled: boolean,
        curveSegments: number,
        steps: number,
        fontName: string,
        font: THREE.Font,
        appliedMaterial: typeof applyMeshNormalMaterial,
        redraw: any,
        mesh: any
      }
      const self = this;
      const Controls = function (this: Controls) {

        // the start geometry and material. Used as the base for the settings in the control UI
        this.appliedMaterial = applyMeshNormalMaterial
        this.castShadow = true;
        this.groundPlaneVisible = true;

        this.size = 90;
        this.height = 90;
        
        this.bevelThickness = 2;
        this.bevelSize = 0.5;
        this.bevelEnabled = true;
        this.bevelSegments = 3;
        this.bevelEnabled = true;
        this.curveSegments = 12;
        this.steps = 1;
        this.fontName = 'bitstream vera sans mono';

        // redraw function, updates the control UI and recreates the geometry.
        this.redraw = function () {
          const loader = new THREE.FontLoader();
          // const json = JSON.parse(jsonFile); // you have to parse the data so it becomes a JS object 
          // const font = loader.parse(json);
          switch (controls.fontName) {
            case 'bitstream vera sans mono':
              controls.font = loader.parse(font1);
              break;
            case 'helvetiker':
              controls.font = loader.parse(font2);
              break;
            case 'helvetiker bold':
              controls.font = loader.parse(font3);
              break;
          }

          redrawGeometryAndUpdateUI(self.gui, scene, controls, function () {
            var options = {
              size: controls.size,
              height: controls.height,
              font: controls.font,
              bevelThickness: controls.bevelThickness,
              bevelSize: controls.bevelSize,
              bevelSegments: controls.bevelSegments,
              bevelEnabled: controls.bevelEnabled,
              curveSegments: controls.curveSegments,
              steps: controls.steps,
            };

            var geom = new THREE.TextGeometry('Learning Three.js', options);
            geom.applyMatrix4(new THREE.Matrix4().makeScale(0.05, 0.05, 0.05));
            geom.center();

            return geom;
          });
        };
      } as any as { new(): Controls; };;
      const controls = new Controls();

      this.gui.add(controls, 'size', 0, 200).onChange(controls.redraw);
      this.gui.add(controls, 'height', 0, 200).onChange(controls.redraw);
      this.gui.add(controls, 'fontName', ['bitstream vera sans mono', 'helvetiker', 'helvetiker bold']).onChange(controls.redraw);
      this.gui.add(controls, 'bevelThickness', 0, 10).onChange(controls.redraw);
      this.gui.add(controls, 'bevelSize', 0, 10).onChange(controls.redraw);
      this.gui.add(controls, 'bevelSegments', 0, 30).step(1).onChange(controls.redraw);
      this.gui.add(controls, 'bevelEnabled').onChange(controls.redraw);
      this.gui.add(controls, 'curveSegments', 1, 30).step(1).onChange(controls.redraw);
      this.gui.add(controls, 'steps', 1, 5).step(1).onChange(controls.redraw);
      // add a material section, so we can switch between materials
      this.gui.add(controls, 'appliedMaterial', {
        meshNormal: applyMeshNormalMaterial,
        meshStandard: applyMeshStandardMaterial
      }).onChange(controls.redraw)

      this.gui.add(controls, 'castShadow').onChange(function (e) { controls.mesh.castShadow = e })
      this.gui.add(controls, 'groundPlaneVisible').onChange(function (e) { groundPlane.material.visible = e })

      // initialize the first redraw so everything gets initialized
      controls.redraw()
      // render and animation
      let step = 0;
      const render = () => {
        controls.mesh.rotation.y = step += 0.005
        controls.mesh.rotation.x = step
        controls.mesh.rotation.z = step
        requestAnimationFrame(render);
        renderer.render(scene, camera);
      }
      render();
    }

  }

  render() {
    return <div ref={this.wrapRef} className="gl-wrapper"></div>;
  }
}

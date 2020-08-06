/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-06 13:49:54
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-06 14:31:55
 * @Description: 根据传入函数生成多种几何体
 */
import React, { Component } from "react";
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { initRenderer, initCamera, addLargeGroundPlane, initDefaultLighting, applyMeshNormalMaterial, applyMeshStandardMaterial, redrawGeometryAndUpdateUI } from '../../../util/util.js';

export default class ParametricGeometry extends Component<any, any> {
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
      const renderer = initRenderer(wrap, undefined);
      const camera = initCamera(wrap, undefined);
      const scene = new THREE.Scene();
      // const axes = new THREE.AxesHelper(20);
      // scene.add(axes);
      const groundPlane = addLargeGroundPlane(scene, undefined);
      groundPlane.position.y = -30;
      initDefaultLighting(scene, undefined);

      const radialWave = (u: number, v: number, optionalTarget?: THREE.Vector3): THREE.Vector3 => {

        const result = optionalTarget || new THREE.Vector3();
        const r = 50;
        const x = Math.sin(u) * r;
        const z = Math.sin(v / 2) * 2 * r;
        const y = (Math.sin(u * 4 * Math.PI) + Math.cos(v * 2 * Math.PI)) * 2.8;

        return result.set(x, y, z);
      };

      const klein = (u: number, v: number, optionalTarget?: THREE.Vector3): THREE.Vector3 => {

        const result = optionalTarget || new THREE.Vector3();

        u *= Math.PI;
        v *= 2 * Math.PI;

        u = u * 2;
        var x, y, z;
        if (u < Math.PI) {
          x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(u) * Math.cos(v);
          z = -8 * Math.sin(u) - 2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);
        } else {
          x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(v + Math.PI);
          z = -8 * Math.sin(u);
        }

        y = -2 * (1 - Math.cos(u) / 2) * Math.sin(v);

        return result.set(x, y, z);
      };

      const mobius = (u: number, t: number, optionalTarget?: THREE.Vector3): THREE.Vector3 => {

        const result = optionalTarget || new THREE.Vector3();
        // flat mobius strip
        // http://www.wolframalpha.com/input/?i=M%C3%B6bius+strip+parametric+equations&lk=1&a=ClashPrefs_*Surface.MoebiusStrip.SurfaceProperty.ParametricEquations-
        u = u - 0.5;
        var v = 2 * Math.PI * t;

        var x, y, z;

        var a = 20;

        x = Math.cos(v) * (a + u * Math.cos(v / 2));
        y = Math.sin(v) * (a + u * Math.cos(v / 2));
        z = u * Math.sin(v / 2);

        return result.set(x, y, z);

      };

      const mobius3d = (u: number, t: number, optionalTarget?: THREE.Vector3): THREE.Vector3 => {

        const result = optionalTarget || new THREE.Vector3();
        // volumetric mobius strip

        u *= Math.PI;
        t *= 2 * Math.PI;

        u = u * 2;
        var phi = u / 2;
        var major = 2.25, a = 0.125, b = 0.65;

        var x, y, z;

        x = a * Math.cos(t) * Math.cos(phi) - b * Math.sin(t) * Math.sin(phi);
        z = a * Math.cos(t) * Math.sin(phi) + b * Math.sin(t) * Math.cos(phi);
        y = (major + x) * Math.sin(u);
        x = (major + x) * Math.cos(u);

        return result.set(x, y, z);

      }


      interface Controls {
        // members of your "class" go here
        castShadow: boolean,
        groundPlaneVisible: boolean,
        planeGeometry: THREE.PlaneGeometry,
        slices: number,
        stacks: number,
        renderFunction: string,
        heightSegments: number,
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

        this.slices = 50;
        this.stacks = 50;
        this.renderFunction = "radialWave"

        this.redraw = function () {
          redrawGeometryAndUpdateUI(self.gui, scene, controls, function () {
            let geom: THREE.ParametricGeometry
            switch (controls.renderFunction) {
              case "radialWave":
                geom = new THREE.ParametricGeometry(radialWave, controls.slices, controls.stacks);
                geom.center();
                return geom;

              case "klein":
                geom = new THREE.ParametricGeometry(klein, controls.slices, controls.stacks);
                geom.center();
                return geom;

              case "mobius":
                geom = new THREE.ParametricGeometry(mobius, controls.slices, controls.stacks);
                geom.center();
                return geom;

              case "mobius3d":
                geom = new THREE.ParametricGeometry(mobius3d, controls.slices, controls.stacks);
                geom.center();
                return geom;

            }
          });
        }
      } as any as { new(): Controls; };;
      const controls = new Controls();
      this.gui.add(controls, 'renderFunction', ["radialWave", "klein", 'mobius', 'mobius3d']).onChange(controls.redraw);
      this.gui.add(controls, 'appliedMaterial', {
        meshNormal: applyMeshNormalMaterial,
        meshStandard: applyMeshStandardMaterial
      }).onChange(controls.redraw)

      this.gui.add(controls, 'slices', 10, 120, 1).onChange(controls.redraw);
      this.gui.add(controls, 'stacks', 10, 120, 1).onChange(controls.redraw);
      this.gui.add(controls, 'castShadow').onChange(function (e) { controls.mesh.castShadow = e })
      this.gui.add(controls, 'groundPlaneVisible').onChange(function (e) { groundPlane.material.visible = e })
      // initialize the first redraw so everything gets initialized
      controls.redraw();
      let step = 0;
      const render = () => {
        controls.mesh.rotation.y = step += 0.01
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
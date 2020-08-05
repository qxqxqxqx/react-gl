/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-05 15:44:29
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-05 16:14:26
 * @Description: 高级几何体 => 接收自定义vector定点数组绘制
 */
import React, { Component } from "react";
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry';
import { initRenderer, initCamera, addLargeGroundPlane, initDefaultLighting, applyMeshNormalMaterial, applyMeshStandardMaterial, redrawGeometryAndUpdateUI } from '../../../util/util.js';

export default class ConvexGeometryBox extends Component<any, any> {
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
      // const axes = new THREE.AxesHelper(20);
      // scene.add(axes);
      // add ground plane
      const groundPlane = addLargeGroundPlane(scene, undefined);
      groundPlane.position.y = -30;
      // add light
      initDefaultLighting(scene, undefined);
      let spGroup:any
      const generatePoints = (): ConvexGeometry => {

        if (spGroup) scene.remove(spGroup)
        // add 10 random spheres
        const points = [];
        for (let i = 0; i < 20; i++) {
          let randomX = -15 + Math.round(Math.random() * 30);
          let randomY = -15 + Math.round(Math.random() * 30);
          let randomZ = -15 + Math.round(Math.random() * 30);

          points.push(new THREE.Vector3(randomX, randomY, randomZ));
        }

        spGroup = new THREE.Object3D();
        const material = new THREE.MeshBasicMaterial({
          color: 0xff0000,
          transparent: false
        });
        points.forEach(function (point) {
          const spGeom = new THREE.SphereGeometry(0.2);
          const spMesh = new THREE.Mesh(spGeom, material);
          spMesh.position.copy(point);
          spGroup.add(spMesh);
        });
        // add the points as a group to the scene
        scene.add(spGroup);

        // use the same points to create a convexgeometry
        const convexGeometry = new ConvexGeometry(points);
        convexGeometry.computeVertexNormals();
        convexGeometry.computeFaceNormals();
        convexGeometry.normalsNeedUpdate = true;
        return convexGeometry;
      }

      interface Controls {
        // members of your "class" go here
        castShadow: boolean,
        groundPlaneVisible: boolean,
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

        // redraw function, updates the control UI and recreates the geometry.
        this.redraw = function () {
          redrawGeometryAndUpdateUI(self.gui, scene, controls, function () {
            return generatePoints()
          });
        };
      } as any as { new(): Controls; };;
      const controls = new Controls();
      // add a material section, so we can switch between materials
      this.gui.add(controls, 'appliedMaterial', {
        meshNormal: applyMeshNormalMaterial,
        meshStandard: applyMeshStandardMaterial
      }).onChange(controls.redraw)

      this.gui.add(controls, 'castShadow').onChange(function (e) { controls.mesh.castShadow = e })
      this.gui.add(controls, 'groundPlaneVisible').onChange(function (e) { groundPlane.material.visible = e })

      // initialize the first redraw so everything gets initialized
      controls.redraw();
      // render and animation
      let step = 0;
      const render = () => {
        controls.mesh.rotation.y = step += 0.005
        controls.mesh.rotation.x = step
        controls.mesh.rotation.z = step

        if (spGroup) {
          spGroup.rotation.y = step
          spGroup.rotation.x = step
          spGroup.rotation.z = step
        }
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


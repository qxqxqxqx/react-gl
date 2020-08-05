/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-05 17:41:58
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-05 18:02:58
 * @Description: 由曲线生成管道
 */
import React, { Component } from "react";
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { initRenderer, initCamera, addLargeGroundPlane, initDefaultLighting, applyMeshNormalMaterial, applyMeshStandardMaterial, redrawGeometryAndUpdateUI } from '../../../util/util.js';

export default class TubeGeometry extends Component<any, any> {
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
      let spGroup: any;
      const generatePoints = (points: Array<THREE.Vector3>, segments: number, radius: number, radiusSegments: number, closed: boolean): THREE.TubeGeometry => {
        // add n random spheres

        if (spGroup) scene.remove(spGroup)
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
        return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), segments, radius, radiusSegments, closed);
      }
      interface Controls {
        // members of your "class" go here
        castShadow: boolean,
        groundPlaneVisible: boolean,
        depth: number,
        numberOfPoints: number,
        segments: number,
        radius: number,
        radiusSegments: number,
        closed: boolean,
        points: Array<THREE.Vector3>,
        newPoints: (value?: any) => void,
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

        this.numberOfPoints = 5;
        this.segments = 64;
        this.radius = 1;
        this.radiusSegments = 8;
        this.closed = false;
        this.points = [];
        // we need the first child, since it's a multimaterial

        this.newPoints = function () {
          const points = [];
          for (let i = 0; i < controls.numberOfPoints; i++) {
            const randomX = -20 + Math.round(Math.random() * 50);
            const randomY = -15 + Math.round(Math.random() * 40);
            const randomZ = -20 + Math.round(Math.random() * 40);

            points.push(new THREE.Vector3(randomX, randomY, randomZ));
          }
          controls.points = points;
          controls.redraw();
        };

        this.redraw = function () {
          redrawGeometryAndUpdateUI(self.gui, scene, controls, function () {
            return generatePoints(controls.points, controls.segments, controls.radius, controls.radiusSegments,
              controls.closed);
          });
        };
      } as any as { new(): Controls; };;
      const controls = new Controls();

      this.gui.add(controls, 'newPoints');
      this.gui.add(controls, 'numberOfPoints', 2, 15).step(1).onChange(controls.newPoints);
      this.gui.add(controls, 'segments', 0, 200).step(1).onChange(controls.redraw);
      this.gui.add(controls, 'radius', 0, 10).onChange(controls.redraw);
      this.gui.add(controls, 'radiusSegments', 0, 100).step(1).onChange(controls.redraw);
      this.gui.add(controls, 'closed').onChange(controls.redraw);
      // add a material section, so we can switch between materials
      this.gui.add(controls, 'appliedMaterial', {
        meshNormal: applyMeshNormalMaterial,
        meshStandard: applyMeshStandardMaterial
      }).onChange(controls.redraw)

      this.gui.add(controls, 'castShadow').onChange(function (e) { controls.mesh.castShadow = e })
      this.gui.add(controls, 'groundPlaneVisible').onChange(function (e) { groundPlane.material.visible = e })

      // initialize the first redraw so everything gets initialized
      controls.newPoints();
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




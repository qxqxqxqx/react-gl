import React, { Component } from "react";
import * as THREE from 'three';
import { initRenderer, initCamera, addLargeGroundPlane, initDefaultLighting } from '../../../util/util.js';

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
    if (this.wrapRef.current) {
      const wrap: HTMLDivElement = this.wrapRef.current;
      const renderer = initRenderer(wrap, undefined);
      const camera = initCamera(wrap, undefined);
      const scene = new THREE.Scene();
      // const axes = new THREE.AxesHelper(20);
      // scene.add(axes);
      const groundPlane = addLargeGroundPlane(scene, undefined);
      groundPlane.position.y = -10;
      initDefaultLighting(scene, undefined);
      // geometry
      const planeGeometry = new THREE.PlaneGeometry(20, 20, 4, 4);
      // material
      const standardMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
      standardMaterial.side = THREE.DoubleSide;
      const normalMaterial = new THREE.MeshNormalMaterial();
      normalMaterial.side = THREE.DoubleSide;
      // const createMultiMaterialObject = (geometry: any, materials: any) => {

      //   var group = new THREE.Group();

      //   for (let i = 0, l = materials.length; i < l; i++) {

      //     group.add(new THREE.Mesh(geometry, materials[i]));

      //   }

      //   return group;

      // }
      // const plane = createMultiMaterialObject(planeGeometry, [standardMaterial,
      //   normalMaterial
      // ]);
      const plane = new THREE.Mesh(planeGeometry, normalMaterial);
      plane.castShadow = true;
      scene.add(plane);
      let step = 0.1;
      const render = () => {
        plane.rotation.y = step += 0.01
        plane.rotation.x = step
        plane.rotation.z = step
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
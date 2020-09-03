/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-19 13:48:04
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-09-02 17:45:33
 * @Description: 路由配置文件
 */
import App from '../views/app/App';
import Home from '../views/home';

import Twod from '../views/home/twod';
import PlanGeometry from '../views/home/twod/PlanGeometry';
import CircleGeometry from '../views/home/twod/CircleGeometry';
import RingGeometry from '../views/home/twod/RingGeometry';
import ShapeGeometry from '../views/home/twod/ShapeGeometry';

import Threed from '../views/home/threed';
import BoxGeometry from '../views/home/threed/BoxGeometry';
import SphereGeometry from '../views/home/threed/SphereGeometry';
import CylinderGeometry from '../views/home/threed/CylinderGeometry';
import ConeGeometry from '../views/home/threed/ConeGeometry';
import TorusGeometry from '../views/home/threed/TorusGeometry';
import TorusKnotGeometry from '../views/home/threed/TorusKnotGeometry';
import PolyhedronGeometry from '../views/home/threed/PolyhedronGeometry';

import Advanced from '../views/home/advanced';
import ConvexGeometryBox from '../views/home/advanced/ConvexGeometryBox';
import LatheGeometry from '../views/home/advanced/LatheGeometry';
import ExtrudeGeometry from '../views/home/advanced/ExtrudeGeometry';
import TubeGeometry from '../views/home/advanced/TubeGeometry';
import ExtrudeSvg from '../views/home/advanced/ExtrudeSvg';
import ParametricGeometry from '../views/home/advanced/ParametricGeometry';
import TextGeometry from '../views/home/advanced/TextGeometry';
import ThreeBSP from '../views/home/advanced/ThreeBSP';

import Spirite from '../views/home/spirite';
import Spirit from '../views/home/spirite/Spirit';
import Points from '../views/home/spirite/Points';
import Particles from '../views/home/spirite/Particles';
import TextureParticles from '../views/home/spirite/TextureParticles';
import MultiTextureParticles from '../views/home/spirite/MultiTextureParticles';
import TextureSprite from '../views/home/spirite/TextureSprite';
import TextureSprites from '../views/home/spirite/TextureSprites';
import TorusKnotPoints from '../views/home/spirite/TorusKnotPoints';

import AdvancedGeo from '../views/home/advancedGeo';
import Group from '../views/home/advancedGeo/Group';
import MergeGeometry from '../views/home/advancedGeo/MergeGeometry';
import SaveLoadMesh from '../views/home/advancedGeo/SaveLoadMesh';
import SaveLoadScene from '../views/home/advancedGeo/SaveLoadScene';
import House from '../views/home/advancedGeo/House';
import OBJLoad from '../views/home/advancedGeo/OBJLoad';
import MTLLoad from '../views/home/advancedGeo/MTLLoad';
import ColladaLoad from '../views/home/advancedGeo/ColladaLoad';
import PDBLoad from '../views/home/advancedGeo/PDBLoad';
import PLYLoad from '../views/home/advancedGeo/PLYLoad';

import Animation from '../views/home/animation';
import Basic from '../views/home/animation/Basic';
import SelectObjects from '../views/home/animation/SelectObjects';
import TweenAnimation from '../views/home/animation/TweenAnimation';
import TrackballControls from '../views/home/animation/TrackballControls';
import FlyControl from '../views/home/animation/FlyControl';
import FirstPersonControl from '../views/home/animation/FirstPersonControl';
import OrbitControl from '../views/home/animation/OrbitControl';
import Horse from '../views/home/animation/Horse';
import MorphTargets from '../views/home/animation/MorphTargets';
import Bones from '../views/home/animation/Bones';

const appRoute = {
  component: App,
  path: '/',
  exact: true,
};

export const homeTwodRoute = {
  path: '/home/twod',
  component: Twod,
  name: Twod.name,
  title: '二维图形',
  routes: [
    {
      path: '/home/twod/PlanGeometry',
      exact: true,
      component: PlanGeometry,
      name: 'PlanGeometry',
    },
    {
      path: '/home/twod/CircleGeometry',
      exact: true,
      component: CircleGeometry,
      name: 'CircleGeometry',
    },
    {
      path: '/home/twod/RingGeometry',
      exact: true,
      component: RingGeometry,
      name: 'RingGeometry',
    },
    {
      path: '/home/twod/ShapeGeometry',
      exact: true,
      component: ShapeGeometry,
      name: 'ShapeGeometry',
    },
  ],
};

export const homeThreedRoute = {
  path: '/home/threed',
  component: Threed,
  name: Threed.name,
  title: '三维图形',
  routes: [
    {
      path: '/home/threed/BoxGeometry',
      exact: true,
      component: BoxGeometry,
      name: 'BoxGeometry',
    },
    {
      path: '/home/threed/SphereGeometry',
      exact: true,
      component: SphereGeometry,
      name: 'SphereGeometry',
    },
    {
      path: '/home/threed/CylinderGeometry',
      exact: true,
      component: CylinderGeometry,
      name: 'CylinderGeometry',
    },
    {
      path: '/home/threed/ConeGeometry',
      exact: true,
      component: ConeGeometry,
      name: 'ConeGeometry',
    },
    {
      path: '/home/threed/TorusGeometry',
      exact: true,
      component: TorusGeometry,
      name: 'TorusGeometry',
    },
    {
      path: '/home/threed/TorusKnotGeometry',
      exact: true,
      component: TorusKnotGeometry,
      name: 'TorusKnotGeometry',
    },
    {
      path: '/home/threed/PolyhedronGeometry',
      exact: true,
      component: PolyhedronGeometry,
      name: 'PolyhedronGeometry',
    },
  ],
};

export const homeAdvancedRoute = {
  component: Advanced,
  path: '/home/advanced',
  name: Advanced.name,
  title: '高级几何体',
  routes: [
    {
      component: ConvexGeometryBox,
      path: '/home/advanced/ConvexGeometryBox',
      exact: true,
      name: 'ConvexGeometryBox',
    },
    {
      component: LatheGeometry,
      path: '/home/advanced/LatheGeometry',
      exact: true,
      name: 'LatheGeometry',
    },
    {
      component: ExtrudeGeometry,
      path: '/home/advanced/ExtrudeGeometry',
      exact: true,
      name: 'ExtrudeGeometry',
    },
    {
      component: TubeGeometry,
      path: '/home/advanced/TubeGeometry',
      exact: true,
      name: 'TubeGeometry',
    },
    {
      component: ExtrudeSvg,
      path: '/home/advanced/ExtrudeSvg',
      exact: true,
      name: 'ExtrudeSvg',
    },
    {
      component: ParametricGeometry,
      path: '/home/advanced/ParametricGeometry',
      exact: true,
      name: 'ParametricGeometry',
    },
    {
      component: TextGeometry,
      path: '/home/advanced/TextGeometry',
      exact: true,
      name: 'TextGeometry',
    },
    {
      component: ThreeBSP,
      path: '/home/advanced/ThreeBSP',
      exact: true,
      name: 'ThreeBSP',
    },
  ],
};

export const homeSpiriteRoute = {
  component: Spirite,
  path: '/home/spirite',
  name: Spirite.name,
  title: '粒子与精灵',
  routes: [
    {component: Spirit, path: '/home/spirite/Spirit', exact: true, name: Spirit.name},
    {component: Points, path: '/home/spirite/Points', exact: true, name: Points.name},
    {component: Particles, path: '/home/spirite/Particles', exact: true, name: Particles.name},
    {component: TextureParticles, path: '/home/spirite/TextureParticles', exact: true, name: TextureParticles.name},
    {component: MultiTextureParticles, path: '/home/spirite/MultiTextureParticles', exact: true, name: MultiTextureParticles.name},
    {component: TextureSprite, path: '/home/spirite/TextureSprite', exact: true, name: TextureSprite.name},
    {component: TextureSprites, path: '/home/spirite/TextureSprites', exact: true, name: TextureSprites.name},
    {component: TorusKnotPoints, path: '/home/spirite/TorusKnotPoints', exact: true, name: TorusKnotPoints.name},
  ],
};

export const homeAdvancedGeoRoute = {
  component: AdvancedGeo,
  path: '/home/advancedGeo',
  name: AdvancedGeo.name,
  title: '创建加载高级网格和几何体',
  routes: [
    {component: Group, path: '/home/advancedGeo/Group', exact: true, name: Group.name},
    {component: MergeGeometry, path: '/home/advancedGeo/MergeGeometry', exact: true, name: MergeGeometry.name},
    {component: SaveLoadMesh, path: '/home/advancedGeo/SaveLoadMesh', exact: true, name: SaveLoadMesh.name},
    {component: SaveLoadScene, path: '/home/advancedGeo/SaveLoadScene', exact: true, name: SaveLoadScene.name},
    {component: House, path: '/home/advancedGeo/House', exact: true, name: House.name},
    {component: OBJLoad, path: '/home/advancedGeo/OBJLoad', exact: true, name: OBJLoad.name},
    {component: MTLLoad, path: '/home/advancedGeo/MTLLoad', exact: true, name: MTLLoad.name},
    {component: ColladaLoad, path: '/home/advancedGeo/ColladaLoad', exact: true, name: ColladaLoad.name},
    {component: PDBLoad, path: '/home/advancedGeo/PDBLoad', exact: true, name: PDBLoad.name},
    {component: PLYLoad, path: '/home/advancedGeo/PLYLoad', exact: true, name: PLYLoad.name},
  ],
};

export const homeAnimationRoute = {
  component: Animation,
  path: '/home/animation',
  name: Animation.name,
  title: '创建动画和移动摄像机',
  routes: [
    {component: Basic, path: '/home/animation/basic', exact: true, name: Basic.name},
    {component: SelectObjects, path: '/home/animation/selectObjects', exact: true, name: SelectObjects.name},
    {component: TweenAnimation, path: '/home/animation/tweenAnimation', exact: true, name: TweenAnimation.name},
    {component: TrackballControls, path: '/home/animation/trackballControls', exact: true, name: TrackballControls.name},
    {component: FlyControl, path: '/home/animation/flyControl', exact: true, name: FlyControl.name},
    {component: FirstPersonControl, path: '/home/animation/firstPersonControl', exact: true, name: FirstPersonControl.name},
    {component: OrbitControl, path: '/home/animation/orbitControl', exact: true, name: OrbitControl.name},
    {component: Horse, path: '/home/animation/horse', exact: true, name: Horse.name},
    {component: MorphTargets, path: '/home/animation/morphTargets', exact: true, name: MorphTargets.name},
    {component: Bones, path: '/home/animation/bones', exact: true, name: Bones.name},
  ],
};

const homeRoute = {
  component: Home,
  path: '/home',
  routes: [homeTwodRoute, homeThreedRoute, homeAdvancedRoute, homeSpiriteRoute, homeAdvancedGeoRoute, homeAnimationRoute],
};

export default [appRoute, homeRoute];

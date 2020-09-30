import Native from '../views/native';

import Twod from '../views/native/twod';
import PlanGeometry from '../views/native/twod/PlanGeometry';
import CircleGeometry from '../views/native/twod/CircleGeometry';
import RingGeometry from '../views/native/twod/RingGeometry';
import ShapeGeometry from '../views/native/twod/ShapeGeometry';

import Threed from '../views/native/threed';
import BoxGeometry from '../views/native/threed/BoxGeometry';
import SphereGeometry from '../views/native/threed/SphereGeometry';
import CylinderGeometry from '../views/native/threed/CylinderGeometry';
import ConeGeometry from '../views/native/threed/ConeGeometry';
import TorusGeometry from '../views/native/threed/TorusGeometry';
import TorusKnotGeometry from '../views/native/threed/TorusKnotGeometry';
import PolyhedronGeometry from '../views/native/threed/PolyhedronGeometry';

import Advanced from '../views/native/advanced';
import ConvexGeometryBox from '../views/native/advanced/ConvexGeometryBox';
import LatheGeometry from '../views/native/advanced/LatheGeometry';
import ExtrudeGeometry from '../views/native/advanced/ExtrudeGeometry';
import TubeGeometry from '../views/native/advanced/TubeGeometry';
import ExtrudeSvg from '../views/native/advanced/ExtrudeSvg';
import ParametricGeometry from '../views/native/advanced/ParametricGeometry';
import TextGeometry from '../views/native/advanced/TextGeometry';
import ThreeBSP from '../views/native/advanced/ThreeBSP';

import Spirite from '../views/native/spirite';
import Spirit from '../views/native/spirite/Spirit';
import Points from '../views/native/spirite/Points';
import Particles from '../views/native/spirite/Particles';
import TextureParticles from '../views/native/spirite/TextureParticles';
import MultiTextureParticles from '../views/native/spirite/MultiTextureParticles';
import TextureSprite from '../views/native/spirite/TextureSprite';
import TextureSprites from '../views/native/spirite/TextureSprites';
import TorusKnotPoints from '../views/native/spirite/TorusKnotPoints';

import AdvancedGeo from '../views/native/advancedGeo';
import Group from '../views/native/advancedGeo/Group';
import MergeGeometry from '../views/native/advancedGeo/MergeGeometry';
import SaveLoadMesh from '../views/native/advancedGeo/SaveLoadMesh';
import SaveLoadScene from '../views/native/advancedGeo/SaveLoadScene';
import House from '../views/native/advancedGeo/House';
import OBJLoad from '../views/native/advancedGeo/OBJLoad';
import MTLLoad from '../views/native/advancedGeo/MTLLoad';
import ColladaLoad from '../views/native/advancedGeo/ColladaLoad';
import PDBLoad from '../views/native/advancedGeo/PDBLoad';
import PLYLoad from '../views/native/advancedGeo/PLYLoad';

import Animation from '../views/native/animation';
import Basic from '../views/native/animation/Basic';
import SelectObjects from '../views/native/animation/SelectObjects';
import TweenAnimation from '../views/native/animation/TweenAnimation';
import TrackballControls from '../views/native/animation/TrackballControls';
import FlyControl from '../views/native/animation/FlyControl';
import FirstPersonControl from '../views/native/animation/FirstPersonControl';
import OrbitControl from '../views/native/animation/OrbitControl';
import Horse from '../views/native/animation/Horse';
import MorphTargets from '../views/native/animation/MorphTargets';
import Bones from '../views/native/animation/Bones';
import AniMixer from '../views/native/animation/AniMixer';
import ColladaModel from '../views/native/animation/ColladaModel';
import MD2Model from '../views/native/animation/MD2Model';
import GltfModel from '../views/native/animation/GltfModel';
import FBXModel from '../views/native/animation/FBXModel';
import XModel from '../views/native/animation/XModel';
import BVHModel from '../views/native/animation/BVHModel';

export const homeTwodRoute = {
  path: '/home/native/twod',
  component: Twod,
  name: Twod.name,
  title: '二维图形',
  routes: [
    {
      path: '/home/native/twod/PlanGeometry',
      exact: true,
      component: PlanGeometry,
      name: 'PlanGeometry',
    },
    {
      path: '/home/native/twod/CircleGeometry',
      exact: true,
      component: CircleGeometry,
      name: 'CircleGeometry',
    },
    {
      path: '/home/native/twod/RingGeometry',
      exact: true,
      component: RingGeometry,
      name: 'RingGeometry',
    },
    {
      path: '/home/native/twod/ShapeGeometry',
      exact: true,
      component: ShapeGeometry,
      name: 'ShapeGeometry',
    },
  ],
};

export const homeThreedRoute = {
  path: '/home/native/threed',
  component: Threed,
  name: Threed.name,
  title: '三维图形',
  routes: [
    {
      path: '/home/native/threed/BoxGeometry',
      exact: true,
      component: BoxGeometry,
      name: 'BoxGeometry',
    },
    {
      path: '/home/native/threed/SphereGeometry',
      exact: true,
      component: SphereGeometry,
      name: 'SphereGeometry',
    },
    {
      path: '/home/native/threed/CylinderGeometry',
      exact: true,
      component: CylinderGeometry,
      name: 'CylinderGeometry',
    },
    {
      path: '/home/native/threed/ConeGeometry',
      exact: true,
      component: ConeGeometry,
      name: 'ConeGeometry',
    },
    {
      path: '/home/native/threed/TorusGeometry',
      exact: true,
      component: TorusGeometry,
      name: 'TorusGeometry',
    },
    {
      path: '/home/native/threed/TorusKnotGeometry',
      exact: true,
      component: TorusKnotGeometry,
      name: 'TorusKnotGeometry',
    },
    {
      path: '/home/native/threed/PolyhedronGeometry',
      exact: true,
      component: PolyhedronGeometry,
      name: 'PolyhedronGeometry',
    },
  ],
};

export const homeAdvancedRoute = {
  component: Advanced,
  path: '/home/native/advanced',
  name: Advanced.name,
  title: '高级几何体',
  routes: [
    {
      component: ConvexGeometryBox,
      path: '/home/native/advanced/ConvexGeometryBox',
      exact: true,
      name: 'ConvexGeometryBox',
    },
    {
      component: LatheGeometry,
      path: '/home/native/advanced/LatheGeometry',
      exact: true,
      name: 'LatheGeometry',
    },
    {
      component: ExtrudeGeometry,
      path: '/home/native/advanced/ExtrudeGeometry',
      exact: true,
      name: 'ExtrudeGeometry',
    },
    {
      component: TubeGeometry,
      path: '/home/native/advanced/TubeGeometry',
      exact: true,
      name: 'TubeGeometry',
    },
    {
      component: ExtrudeSvg,
      path: '/home/native/advanced/ExtrudeSvg',
      exact: true,
      name: 'ExtrudeSvg',
    },
    {
      component: ParametricGeometry,
      path: '/home/native/advanced/ParametricGeometry',
      exact: true,
      name: 'ParametricGeometry',
    },
    {
      component: TextGeometry,
      path: '/home/native/advanced/TextGeometry',
      exact: true,
      name: 'TextGeometry',
    },
    {
      component: ThreeBSP,
      path: '/home/native/advanced/ThreeBSP',
      exact: true,
      name: 'ThreeBSP',
    },
  ],
};

export const homeSpiriteRoute = {
  component: Spirite,
  path: '/home/native/spirite',
  name: Spirite.name,
  title: '粒子与精灵',
  routes: [
    {component: Spirit, path: '/home/native/spirite/Spirit', exact: true, name: Spirit.name},
    {component: Points, path: '/home/native/spirite/Points', exact: true, name: Points.name},
    {component: Particles, path: '/home/native/spirite/Particles', exact: true, name: Particles.name},
    {component: TextureParticles, path: '/home/native/spirite/TextureParticles', exact: true, name: TextureParticles.name},
    {component: MultiTextureParticles, path: '/home/native/spirite/MultiTextureParticles', exact: true, name: MultiTextureParticles.name},
    {component: TextureSprite, path: '/home/native/spirite/TextureSprite', exact: true, name: TextureSprite.name},
    {component: TextureSprites, path: '/home/native/spirite/TextureSprites', exact: true, name: TextureSprites.name},
    {component: TorusKnotPoints, path: '/home/native/spirite/TorusKnotPoints', exact: true, name: TorusKnotPoints.name},
  ],
};

export const homeAdvancedGeoRoute = {
  component: AdvancedGeo,
  path: '/home/native/advancedGeo',
  name: AdvancedGeo.name,
  title: '创建加载高级网格和几何体',
  routes: [
    {component: Group, path: '/home/native/advancedGeo/Group', exact: true, name: Group.name},
    {component: MergeGeometry, path: '/home/native/advancedGeo/MergeGeometry', exact: true, name: MergeGeometry.name},
    {component: SaveLoadMesh, path: '/home/native/advancedGeo/SaveLoadMesh', exact: true, name: SaveLoadMesh.name},
    {component: SaveLoadScene, path: '/home/native/advancedGeo/SaveLoadScene', exact: true, name: SaveLoadScene.name},
    {component: House, path: '/home/native/advancedGeo/House', exact: true, name: House.name},
    {component: OBJLoad, path: '/home/native/advancedGeo/OBJLoad', exact: true, name: OBJLoad.name},
    {component: MTLLoad, path: '/home/native/advancedGeo/MTLLoad', exact: true, name: MTLLoad.name},
    {component: ColladaLoad, path: '/home/native/advancedGeo/ColladaLoad', exact: true, name: ColladaLoad.name},
    {component: PDBLoad, path: '/home/native/advancedGeo/PDBLoad', exact: true, name: PDBLoad.name},
    {component: PLYLoad, path: '/home/native/advancedGeo/PLYLoad', exact: true, name: PLYLoad.name},
  ],
};

export const homeAnimationRoute = {
  component: Animation,
  path: '/home/native/animation',
  name: Animation.name,
  title: '创建动画和移动摄像机',
  routes: [
    {component: Basic, path: '/home/native/animation/basic', exact: true, name: Basic.name},
    {component: SelectObjects, path: '/home/native/animation/selectObjects', exact: true, name: SelectObjects.name},
    {component: TweenAnimation, path: '/home/native/animation/tweenAnimation', exact: true, name: TweenAnimation.name},
    {component: TrackballControls, path: '/home/native/animation/trackballControls', exact: true, name: TrackballControls.name},
    {component: FlyControl, path: '/home/native/animation/flyControl', exact: true, name: FlyControl.name},
    {component: FirstPersonControl, path: '/home/native/animation/firstPersonControl', exact: true, name: FirstPersonControl.name},
    {component: OrbitControl, path: '/home/native/animation/orbitControl', exact: true, name: OrbitControl.name},
    {component: Horse, path: '/home/native/animation/horse', exact: true, name: Horse.name},
    {component: MorphTargets, path: '/home/native/animation/morphTargets', exact: true, name: MorphTargets.name},
    {component: Bones, path: '/home/native/animation/bones', exact: true, name: Bones.name},
    {component: AniMixer, path: '/home/native/animation/aniMixer', exact: true, name: AniMixer.name},
    {component: ColladaModel, path: '/home/native/animation/colladaModel', exact: true, name: ColladaModel.name},
    {component: MD2Model, path: '/home/native/animation/mD2Model', exact: true, name: MD2Model.name},
    {component: GltfModel, path: '/home/native/animation/gltfModel', exact: true, name: GltfModel.name},
    {component: FBXModel, path: '/home/native/animation/FBXModel', exact: true, name: FBXModel.name},
    {component: XModel, path: '/home/native/animation/XModel', exact: true, name: XModel.name},
    {component: BVHModel, path: '/home/native/animation/BVHModel', exact: true, name: BVHModel.name},
  ],
};

const NativeRoute = {
  component: Native,
  path: '/home/native',
  title: 'Native Three',
  routes: [homeTwodRoute, homeThreedRoute, homeAdvancedRoute, homeSpiriteRoute, homeAdvancedGeoRoute, homeAnimationRoute],
};

export default NativeRoute;
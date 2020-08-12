import React from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import {useHistory, useParams} from "react-router-dom";

import PlanGeometry from './twod/PlanGeometry';
import CircleGeometry from './twod/CircleGeometry';
import RingGeometry from './twod/RingGeometry';
import ShapeGeometry from './twod/ShapeGeometry';

import BoxGeometry from './threed/BoxGeometry';
import SphereGeometry from './threed/SphereGeometry';
import CylinderGeometry from './threed/CylinderGeometry';
import ConeGeometry from './threed/ConeGeometry';
import TorusGeometry from './threed/TorusGeometry';
import TorusKnotGeometry from './threed/TorusKnotGeometry';
import PolyhedronGeometry from './threed/PolyhedronGeometry';

import ConvexGeometryBox from './advanced/ConvexGeometryBox';
import LatheGeometry from './advanced/LatheGeometry';
import ExtrudeGeometry from './advanced/ExtrudeGeometry';
import TubeGeometry from './advanced/TubeGeometry';
import ExtrudeSvg from './advanced/ExtrudeSvg';
import ParametricGeometry from './advanced/ParametricGeometry';
import TextGeometry from './advanced/TextGeometry';
import ThreeBSP from './advanced/ThreeBSP';

import Spirit from './spirit/Spirit';
import Points from './spirit/Points';
import Particles from './spirit/Particles';
import TextureParticles from './spirit/TextureParticles';
import MultiTextureParticles from "./spirit/MultiTextureParticles";
import TextureSpirit from './spirit/TextureSpirit';

import './style.scss'

const { SubMenu } = Menu;
const { Header, Content, Footer } = Layout;

export default function Home(): JSX.Element {
  const twoGeo: string[] = [PlanGeometry.name, CircleGeometry.name, RingGeometry.name, ShapeGeometry.name];
  const threeGeo: string[] = [
    BoxGeometry.name,
    SphereGeometry.name,
    CylinderGeometry.name,
    ConeGeometry.name,
    TorusGeometry.name,
    TorusKnotGeometry.name,
    PolyhedronGeometry.name
  ];
  const advancedGeo: string[] = [
    ConvexGeometryBox.name, 
    LatheGeometry.name, 
    ExtrudeGeometry.name, 
    TubeGeometry.name, 
    ExtrudeSvg.name,
    ParametricGeometry.name,
    TextGeometry.name,
    ThreeBSP.name
  ];
  const spirits: string[] =[
    Spirit.name,
    Points.name,
    Particles.name,
    TextureParticles.name,
    MultiTextureParticles.name,
    TextureSpirit.name
  ];
  interface componentsConfig {
    [key: string]: any
  }
  const components: componentsConfig = {
    'PlanGeometry': <PlanGeometry />,
    'CircleGeometry': <CircleGeometry />,
    'RingGeometry': <RingGeometry />,
    'ShapeGeometry': <ShapeGeometry />,
    'BoxGeometry': <BoxGeometry />,
    'SphereGeometry': <SphereGeometry />,
    'CylinderGeometry': <CylinderGeometry />,
    'ConeGeometry': <ConeGeometry />,
    'TorusGeometry': <TorusGeometry />,
    'TorusKnotGeometry': <TorusKnotGeometry />,
    'PolyhedronGeometry': <PolyhedronGeometry />,
    'ConvexGeometryBox': <ConvexGeometryBox />,
    'LatheGeometry': <LatheGeometry />,
    'ExtrudeGeometry': <ExtrudeGeometry />,
    'TubeGeometry': <TubeGeometry />,
    'ExtrudeSvg': <ExtrudeSvg />,
    'ParametricGeometry': <ParametricGeometry />,
    'TextGeometry': <TextGeometry />,
    'ThreeBSP': <ThreeBSP />,
    'Spirit': <Spirit />,
    'Points': <Points />,
    'Particles': <Particles />,
    'TextureParticles': <TextureParticles />,
    'MultiTextureParticles': <MultiTextureParticles />,
    'TextureSpirit': <TextureSpirit />
  }
  let history = useHistory();
  const handleMenuClick = (type: any):void => {

    history.replace(`/home/${type}`)

  }

  let { type } = useParams();

  return (
    <Layout className="layout">
      <Header>
        <div className="logo">React Webgl</div>
        <Menu theme="dark" mode="horizontal" selectedKeys={[type]} onClick={i => handleMenuClick(i.key)}>
          <SubMenu icon={<SettingOutlined />} title="二维图形">
            {
              twoGeo.map(n => (
                <Menu.Item key={n}>{n}</Menu.Item>
              ))
            }
          </SubMenu>
          <SubMenu icon={<SettingOutlined />} title="三维图形">
            {
              threeGeo.map(n => (
                <Menu.Item key={n}>{n}</Menu.Item>
              ))
            }
          </SubMenu>
          <SubMenu icon={<SettingOutlined />} title="高级几何体">
            {
              advancedGeo.map(n => (
                <Menu.Item key={n}>{n}</Menu.Item>
              ))
            }
          </SubMenu>
          <SubMenu icon={<SettingOutlined />} title="粒子与精灵">
            {
              spirits.map(n => (
                <Menu.Item key={n}>{n}</Menu.Item>
              ))
            }
          </SubMenu>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>{type}</Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-content">
          {type && components[type]}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>React Gl ©2020 Created by qxqxqxqx</Footer>
    </Layout>
  );
}
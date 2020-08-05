import React, { useState } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
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

import './style.scss'

const { SubMenu } = Menu;
const { Header, Content, Footer } = Layout;

export default function Home(): JSX.Element{
  // any 大法好
  const [geo, setGeo] = useState<any>('PlanGeometry');
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
  interface componentsConfig {
    [key:string]: any
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
    'PolyhedronGeometry': <PolyhedronGeometry />
  }

  return (
    <Layout className="layout">
      <Header>
        <div className="logo">React Webgl</div>
        <Menu theme="dark" mode="horizontal" selectedKeys={[geo]} onClick={i => setGeo(i.key)}>
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
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>{geo}</Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-content">
          {components[geo]}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>React Gl ©2020 Created by qxqxqxqx</Footer>
    </Layout>
  );
}
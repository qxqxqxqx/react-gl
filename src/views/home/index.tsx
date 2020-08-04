import React, { useState } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import PlanGeometry from './components/PlanGeometry';
import CircleGeometry from './components/CircleGeometry';
import RingGeometry from './components/RingGeometry';
import ShapeGeometry from './components/ShapeGeometry';

import './style.scss'

const { SubMenu } = Menu;
const { Header, Content, Footer } = Layout;

export default function Home(): JSX.Element{
  // any 大法好
  const [geo, setGeo] = useState<any>('PlanGeometry');
  const twoGeo: string[] = [PlanGeometry.name, CircleGeometry.name, RingGeometry.name, ShapeGeometry.name];
  interface twoComponentsConfig {
    [key:string]: any
  }
  const twoComponents: twoComponentsConfig = {
    'PlanGeometry': <PlanGeometry />,
    'CircleGeometry': <CircleGeometry />,
    'RingGeometry': <RingGeometry />,
    'ShapeGeometry': <ShapeGeometry />,
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
          <Menu.Item key="2">nav 2</Menu.Item>
          <Menu.Item key="3">nav 3</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>{geo}</Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-content">
          {twoComponents[geo]}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>React Gl ©2020 Created by qxqxqxqx</Footer>
    </Layout>
  );
}
import React, {ReactElement} from 'react';
import {Layout, Menu, Breadcrumb} from 'antd';
import PlanGeometry from './components/PlanGeometry';

import './style.scss'

const {Header, Content, Footer} = Layout;

export default function Home():ReactElement {
  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
          <Menu.Item key="1">nav 1</Menu.Item>
          <Menu.Item key="2">nav 2</Menu.Item>
          <Menu.Item key="3">nav 3</Menu.Item>
        </Menu>
      </Header>
      <Content style={{padding: '0 50px'}}>
        <Breadcrumb style={{margin: '16px 0'}}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-content">
          <PlanGeometry />
        </div>
      </Content>
      <Footer style={{textAlign: 'center'}}>React Gl ©2020 Created by qxqxqxqx</Footer>
    </Layout>
  );
}
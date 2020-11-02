import React from 'react';
import { renderRoutes } from "react-router-config";
import { Layout, Menu, Breadcrumb } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

import './style.less'

const { SubMenu } = Menu;
const { Header, Content, Footer } = Layout;

export default function Home(props: any): JSX.Element {
  const { route, history } = props;
  const handleMenuClick = (path: any): void => {
    history.replace(path)
  }

  interface Routes {
    path: string,
    name: string,
    title?: string,
    routes?: Routes[]
  }

  const routes: Routes[] = route.routes;
  const pathname: string = history.location.pathname;
  const pathArray: string[] = pathname.split('/');

  return (
    <Layout className="layout">
      <Header className="site-header">
        <div className="logo">React Webgl</div>
        <Menu theme="dark" mode="horizontal" selectedKeys={[pathname]} onClick={i => handleMenuClick(i.key)}>
          {
            routes.map(subRoute => (
              <SubMenu icon={<SettingOutlined />} key={subRoute.path} title={subRoute.title}>
                {
                  subRoute.routes && subRoute.routes.map(routeItem => (
                    <Menu.ItemGroup key={routeItem.path} title={routeItem.title}>
                      {
                        routeItem.routes && routeItem.routes.map(r => (
                          <Menu.Item key={r.path}>{r.name}</Menu.Item>
                        ))
                      }
                    </Menu.ItemGroup>
                  ))
                }
              </SubMenu>
            ))
          }
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          {
            pathArray.map(pathString => pathString && <Breadcrumb.Item key={pathString}>{pathString}</Breadcrumb.Item>)
          }
        </Breadcrumb>
        <div className="site-layout-content">
          {renderRoutes(routes)}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>React Gl ©2020 Created by qxqxqxqx</Footer>
    </Layout>
  );
}
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Button,
  Badge,
  Input,
  Tooltip,
  Typography
} from 'antd';

import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  SearchOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const { Header, Sider, Content, Footer } = Layout;

// 主布局组件
const MainLayout = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = props.location;

// 侧边栏菜单配置
const menuItems = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: <a href="/dashboard">仪表盘</a>,
  },
  {
    key: '/users',
    icon: <UserOutlined />,
    label: <a href="/users">用户管理</a>,
  },
  {
    key: '/settings',
    icon: <SettingOutlined />,
    label: <a href="/settings">系统设置</a>,
  },
];

// 头部用户菜单
const userMenuItems = [
  {
    key: '1',
    label: '个人中心',
  },
  {
    key: '2',
    label: '账户设置',
  },
  {
    key: '3',
    label: '退出登录',
    icon: <LogoutOutlined />,
  },
];

  // 处理侧边栏折叠
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        style={{
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.06)',
          zIndex: 10
        }}
      >
        <div className="logo" style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid #e8e8e8'
        }}>
          <Title level={4} style={{ margin: 0 }}>
            {collapsed ? '管理系统' : '后台管理系统'}
          </Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{
            marginTop: 16,
            borderRight: 0
          }}
        />
      </Sider>

      <Layout>
        {/* 顶部导航 */}
        <Header style={{
          padding: '0 24px',
          background: '#fff',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 5
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleCollapsed}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* 搜索框 */}
            <div style={{ position: 'relative', width: 200 }}>
              <Input
                placeholder="搜索..."
                prefix={<SearchOutlined />}
                style={{ borderRadius: 20, paddingLeft: 36 }}
              />
            </div>

            {/* 通知图标 */}
            <Tooltip title="通知">
              <Badge count={5} dot>
                <BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
              </Badge>
            </Tooltip>

            {/* 用户头像 */}
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <span style={{ marginLeft: 8, display: 'none', md: 'inline-block' }}>管理员</span>
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* 主内容区域 - 显示子路由内容 */}
        <Content style={{
          margin: '24px 16px',
          padding: 24,
          minHeight: 280,
          background: '#fff',
          borderRadius: 4
        }}>
          {props.children}
        </Content>

        {/* 页脚 */}
        <Footer style={{ textAlign: 'center' }}>
          后台管理系统 ©{new Date().getFullYear()} Created with React & Ant Design
        </Footer>
      </Layout>
    </Layout>
  );
};

export default withRouter(MainLayout);

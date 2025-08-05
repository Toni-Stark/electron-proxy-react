import React, { Component } from 'react';
import { Menu, Icon, Layout } from 'antd';
import { Link } from 'react-router-dom';
const { Sider } = Layout;
const { SubMenu } = Menu;

class Sidebar extends Component {
  state = {
    collapsed: false,
    // 当前选中的菜单键
    selectedKey: ['dashboard']
  };

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  handleMenuSelect = ({ key }) => {
    this.setState({
      selectedKey: [key]
    });
  };

  render() {
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={this.state.collapsed}
        className="sidebar-container"
      >
        <div className="logo">
          {!this.state.collapsed && <h1>Admin Panel</h1>}
          {this.state.collapsed && <Icon type="appstore" />}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          // 修正：使用 selectedKeys 替代 current
          selectedKeys={this.state.selectedKey}
          onSelect={this.handleMenuSelect}
        >
          <Menu.Item key="dashboard">
            <Link to="/">
              <Icon type="dashboard" />
              <span>仪表盘</span>
            </Link>
          </Menu.Item>
          
          <SubMenu
            key="user"
            title={
              <span>
                <Icon type="user" />
                <span>用户管理</span>
              </span>
            }
          >
            <Menu.Item key="user-list">
              <Link to="/users">用户列表</Link>
            </Menu.Item>
            <Menu.Item key="user-add">
              <Link to="/users/add">添加用户</Link>
            </Menu.Item>
          </SubMenu>
          
          <Menu.Item key="settings">
            <Link to="/settings">
              <Icon type="setting" />
              <span>系统设置</span>
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}

export default Sidebar;
    
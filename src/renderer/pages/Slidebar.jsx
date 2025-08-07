import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';

const { Sider } = Layout;
const { SubMenu } = Menu;

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      current: '1',
    }
    this.updateStatus = this.updateStatus.bind(this); // 手动绑定
  }
  // 处理菜单折叠
  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  // 处理菜单点击
  handleClick = (e) => {
    this.setState({
      current: e.key,
    });
  };

  render() {
    return (
      <Sider
        collapsible
        collapsed={this.state.collapsed}
        onCollapse={this.onCollapse}
      >
        {/* 系统标题 */}
        <div style={{
          height: '32px',
          background: 'rgba(255,255,255,.2)',
          margin: '16px',
          textAlign: 'center',
          lineHeight: '32px',
          color: '#fff'
        }}>
          管理系统
        </div>

        {/* 菜单列表 */}
        <Menu
          theme="dark"
          current={this.state.current}
          onClick={this.handleClick}
          defaultSelectedKeys={['1']}
          mode="inline"
        >
          <Menu.Item key="1">
            <Icon type="dashboard" />
            <span>仪表盘</span>
            <Link to="/" />
          </Menu.Item>

          <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="user" />
                <span>用户管理</span>
              </span>
            }
          >
            <Menu.Item key="2">
              <Icon type="list" />
              <span>用户列表</span>
              <Link to="/users" />
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="plus" />
              <span>新增用户</span>
              <Link to="/users/add" />
            </Menu.Item>
          </SubMenu>

          <Menu.Item key="4">
            <Icon type="setting" />
            <span>系统设置</span>
            <Link to="/settings" />
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}

export default Sidebar;

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Menu from 'antd/lib/menu'
import Icon from 'antd/lib/icon'
import Layout from 'antd/lib/layout'

import 'antd/lib/menu/style/index.css';
import 'antd/lib/icon/style/index.css';
import 'antd/lib/layout/style/index.css';

import './index.css'

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
                    <div className="name"> 商调工具 </div>
                    <div className="name"> 商调工具 </div>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={this.state.selectedKey}
                    onSelect={this.handleMenuSelect}
                >
                    <Menu.Item key="dashboard">
                        <Link to="/">
                            <Icon type="dashboard" />
                            <span>店铺调研</span>
                        </Link>
                    </Menu.Item>

                    <SubMenu
                        key="store"
                        title={
                            <span>
                                <Icon type="shop" />
                                <span>店铺调研</span>
                            </span>
                        }
                    >
                        <Menu.Item key="meituan">
                            <Link to="/meituan">美团</Link>
                        </Menu.Item>
                        <Menu.Item key="eleme">
                            <Link to="/eleme">饿了么</Link>
                        </Menu.Item>
                    </SubMenu>
                    {/*<SubMenu*/}
                    {/*    key="user"*/}
                    {/*    title={*/}
                    {/*        <span>*/}
                    {/*            <Icon type="user" />*/}
                    {/*            <span>用户管理</span>*/}
                    {/*        </span>*/}
                    {/*    }*/}
                    {/*>*/}
                    {/*    <Menu.Item key="user-list">*/}
                    {/*        <Link to="/users">用户列表</Link>*/}
                    {/*    </Menu.Item>*/}
                    {/*    <Menu.Item key="user-add">*/}
                    {/*        <Link to="/users/add">添加用户</Link>*/}
                    {/*    </Menu.Item>*/}
                    {/*</SubMenu>*/}

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

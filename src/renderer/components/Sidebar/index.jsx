import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Menu from 'antd/lib/menu'
import Icon from 'antd/lib/icon'
import Layout from 'antd/lib/layout'

import 'antd/lib/menu/style/index.css';
import 'antd/lib/button/style/index.css';
import 'antd/lib/icon/style/index.css';
import 'antd/lib/layout/style/index.css';

import './index.css'

const { Sider } = Layout;
const { SubMenu } = Menu;

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            // 当前选中的菜单键
            selectedKey: ['/'],
            route: [
                {
                    key: '/',
                    name: '控制台',
                    icon: 'dashboard',
                    hash: ''
                },
                // {
                //     key: '/dashboard',
                //     name: '店铺调研',
                //     icon: 'dashboard',
                //     children: [
                //         {
                //             key: '/meituan',
                //             name: '美团',
                //             icon: 'shop',
                //             hash: ''
                //         },
                //         {
                //             key: '/eleme',
                //             name: '饿了么',
                //             icon: 'shop',
                //             hash: ''
                //         }
                //     ]
                // },
                {
                    key: '/settings',
                    name: '系统设置',
                    icon: 'setting',
                    hash: ''
                }
            ]
        };
    }


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
    naviTo = (item) => {
        console.log(item, 'item')
        this.props.addLinks({...item, type: 'add'})
    }
    render() {
        const { route } = this.state;
        return (
            <Sider
                trigger={null}
                collapsible
                collapsed={this.state.collapsed}
                style={{width: 160}}
                className="sidebar-container"
            >
                <div className="logo">
                    <div className="name"> 商调工具 </div>
                </div>
                <div className="body_sid">
                    <Menu
                        theme="dark"
                        mode="inline"
                        selectedKeys={this.state.selectedKey}
                        onSelect={this.handleMenuSelect}
                    >
                        {
                            route.map((item, index)=>{
                                if(item.children){
                                    return (
                                        <SubMenu
                                            key={item.key}
                                            title={
                                                <span>
                                                    <Icon type={item.icon} />
                                                    <span>{item.name}</span>
                                                </span>
                                            }
                                        >
                                            {
                                                item.children.map((child, index)=>{
                                                    return (
                                                        <Menu.Item key={child.key}>
                                                            <div onClick={()=>this.naviTo(child)}>{child.name}</div>
                                                        </Menu.Item>
                                                    )
                                                })
                                            }
                                        </SubMenu>
                                    )
                                }else {
                                    return (
                                        <Menu.Item key={item.key}>
                                            <div onClick={()=>this.naviTo(item)}>
                                                <Icon type={item.icon} />
                                                <span>{item.name}</span>
                                            </div>
                                        </Menu.Item>
                                    )
                                }
                            })
                        }
                    </Menu>
                </div>
                <div className="footer_sid">
                    <div
                        className="out_login"
                        onClick={this.props.getOut}
                    >
                        <Icon type="logout" style={{ marginRight: 7 }} />
                        退出登录
                    </div>
                </div>
            </Sider>
        );
    }
}

export default Sidebar;

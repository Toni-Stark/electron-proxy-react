import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Menu from 'antd/lib/menu'
import Icon from 'antd/lib/icon'
import Layout from 'antd/lib/layout'
import notification from "antd/lib/notification";
import Switch from "antd/lib/switch";
import Button from "antd/lib/button";

import 'antd/lib/menu/style/index.css';
import 'antd/lib/button/style/index.css';
import 'antd/lib/icon/style/index.css';
import 'antd/lib/layout/style/index.css';
import 'antd/lib/switch/style/index.css';
import 'antd/lib/notification/style/index.css';

import './index.css'

const { Sider } = Layout;
const { SubMenu } = Menu;

const openMessage = (type, text) => {
    notification[type]({
        message: text,
    });
};

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
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
                // {
                //     key: '/settings',
                //     name: '系统设置',
                //     icon: 'setting',
                //     hash: ''
                // }
            ],
            openProxy:false,
            running: false,
            port: 0,
        };
        this.updateStatus = this.updateStatus.bind(this); // 手动绑定
    }
    async componentDidMount() {
        console.log('页面注册')
        await this.updateStatus()
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

    updateStatus = async () => {
        const current = await window.drugApi.getStatus()
        console.log('当前状态:', current)
        this.setState({
            running: current.running,
            port: current.port,
            openProxy: current.running,
        })
    }
    handleImmediateChange = async (key, value) => {
        await this.setState({ [key]: value }, async () => {
            console.log(`${key} 更新为:`, value);
            if(key === 'openProxy'){
                if(value){
                    const success = await window.drugApi.start()
                    if (success) {
                        openMessage('success', '启动成功，请正常浏览小程序')
                    } else {
                        openMessage('error', '启动失败，请以管理员身份运行并安装证书至受信任的根证书颁发机构')
                    }
                    await this.updateStatus()
                } else {
                    const success = await window.drugApi.stop()
                    if (success) {
                        openMessage('info', '已停止')
                        await this.updateStatus()
                    }
                }
            }
        });
    };
    render() {
        const { route,openProxy,port, running} = this.state;
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
                    <div className="proxy_status">
                        {/*<div className="proxy_status_title">端口<span>{port}</span></div>*/}
                        {/*<div className="proxy_status_title">状态<span style={{color: running ? '#52c41a' : 'rgba(255,255,255,0.65)'}}>{ running ? '开始工作' : '停止工作' }</span></div>*/}
                        <div className="proxy_control">
                            <div>工作状态</div>
                            <Switch
                                checkedChildren="开始"
                                unCheckedChildren="停止"
                                checked={openProxy}
                                onChange={(checked) => this.handleImmediateChange('openProxy', checked)}
                            />
                        </div>
                    </div>
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

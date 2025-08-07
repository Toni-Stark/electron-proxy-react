import React, { Component } from 'react';
import {Icon , Button, message, Input, Avatar} from 'antd';
import { setToken } from '../utils/auth';
import '../styles/Login.css'
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this); // 手动绑定
        this.currentToken = this.currentToken.bind(this); // 手动绑定
    }
    handleSubmit = async () => {
        if (!this.state.token.trim()) {
            message.warning('请输入Token');
            return;
        }

        this.setState({loading: true});
        const res = await window.drugApi.userLogin(this.state.token)
        if(res.code != 200){
            message.error(res.msg);
            this.setState({loading: false});
            return;
        }
        this.setState({loading: false});
        message.success('登录成功');
        setToken(this.state.token)
        this.props.onAuthChange(true)
    };
    currentToken = (e) => {
        let value = e.target.value;
        this.setState({
            token: value
        })
    }
    render() {
        const {token,loading} = this.state;
        return (
            <div style={{...flexCenter}} className="bg_style">
                <div style={{marginTop: '20vh', minWidth: 350}}>
                    <div style={flexCenter}>
                        <Avatar
                            size={100}
                            icon="user"
                        />
                        <h2 style={{ marginTop: 16, zIndex: 3 }}>Token 登录</h2>
                    </div>

                    <Input.Password
                        prefix={<Icon type="lock" />}
                        placeholder="请输入访问密码"
                        size="large"
                        style={marginTop}
                        value={token}
                        onChange={this.currentToken}
                    />
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        block
                        style={marginTop}
                        loading={loading}
                        onClick={this.handleSubmit}
                    >
                        登录
                    </Button>
                </div>
            </div>
        );
    }
}

export default Login;
const flexCenter = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
}
const marginTop = {
    marginTop: 10
}

import React, { Component } from 'react';
import {Icon , Button, message, Input, Avatar} from 'antd';
import { setToken } from '../utils/auth';
class Login extends Component {
    state = {
        token: ''
    }
    handleSubmit = () => {
        if (!this.state.token.trim()) {
            message.warning('请输入Token');
            return;
        }

        this.setState({loading: true});
        setTimeout(() => {
            this.setState({loading: false});
            message.success('登录成功');
            setToken(this.state.token)
            this.props.onAuthChange(true)
            // 这里跳转到主页
        }, 1000);
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
            <div style={{...flexCenter, height: '100vh'}}>
                <div style={{marginTop: '20vh', minWidth: 350}}>
                    <div style={flexCenter}>
                        <Avatar
                            size={100}
                            icon="user"
                        />
                        <h2 style={{ marginTop: 16 }}>Token 登录</h2>
                    </div>

                    <Input
                        prefix={<Icon type="lock" />}
                        placeholder="请输入访问Token"
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

import React, { Component } from 'react'
import Layout from 'antd/lib/layout'
import Button from 'antd/lib/button'

import 'antd/lib/button/style/index.css';

import {getToken, removeToken} from './utils/auth'
const { Content, Footer, Header } = Layout;

class App extends Component {
  state = {
    loading: false,
    isAuthenticated: !!getToken()
  };
  // 登录状态变更处理
  handleAuthChange = (isAuthenticated) => {
    this.setState({ isAuthenticated });
  };
  getOut = () => {
    removeToken()
    this.setState({ isAuthenticated: !!getToken() })
  }
  render() {
    const { isAuthenticated, loading } = this.state;

    
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <h3>hihihih</h3>
        <Button>alsjdlfajsdkf</Button>
      </Layout>
    );
  }
}

export default App;

const flexFull = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }
const btnStyle = {
  width: '100px',
  marginRight: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}
const flexEnd = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '100%',
  paddingLeft: '15px'
}

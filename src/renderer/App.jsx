import React, { Component } from 'react';
import {Button, Layout, message, Spin} from 'antd';
import {Redirect, Route, Switch} from 'react-router-dom';
import Sidebar from './components/Sidebar/index';
import Dashboard from './pages/Dashboard';
import UserList from './pages/UserList';
import Setting from './pages/Setting';
import NotFound from './pages/NotFound';
import UserAdd from "./pages/UserAdd";
import {getToken, removeToken} from './utils/auth'
import Login from "./pages/Login";
import EleList from "./pages/ElemeList";
import MeiTuanList from "./pages/MeiTuanList";

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

    if (loading) {
      return (
          <div style={flexFull}>
            <Spin size="large" />
          </div>
      );
    }

    if (!isAuthenticated) {
      return (
          <Switch>
            <Route
                path="/login"
                render={(props) => (
                    <Login {...props} onAuthChange={this.handleAuthChange} />
                )}
            />
            <Redirect to="/login" />
          </Switch>
      );
    }

    return (
      <Layout style={{ minHeight: '100vh' }}>
        {/* 左侧菜单 */}
        <Sidebar />

        {/* 右侧内容区 */}
        <Layout>
          <Header value={Header} style={{height: 50, padding: 0}}>
            <div style={flexEnd}>

              <Button
                  style={btnStyle}
                  type="default"
                  block
                  icon="poweroff"
                  onClick={this.getOut}
              >
                退出登录
              </Button>
            </div>
          </Header>
          <Content style={{
            margin: '16px',
            padding: '16px',
            background: '#fff',
            minHeight: 280
          }}>
            {/* 路由配置 */}
            <Switch>
              <Route exact path="/" component={Dashboard} />
              <Route path="/users/add" component={UserAdd} />
              <Route path="/users" component={UserList} />
              <Route path="/meituan" component={MeiTuanList} />
              <Route path="/eleme" component={EleList} />
              <Route path="/settings" component={Setting} />
              <Redirect from="/login" to="/" />
              <Route component={NotFound} />
            </Switch>
          </Content>

          {/* 页脚 */}
          <Footer style={{ textAlign: 'center' }}>
            后台管理系统 ©{new Date().getFullYear()}
            Created with React {React.version} & Ant Design
          </Footer>
        </Layout>
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
  justifyContent: 'flex-end',
  alignItems: 'center',
  height: '100%'
}

import React, { Component } from 'react';
import Layout from 'antd/lib/layout'
import Button from 'antd/lib/button'
import Spin from 'antd/lib/spin'
import {Redirect, Route, Switch} from 'react-router-dom';
import Sidebar from './components/Sidebar/index';
import Dashboard from './pages/Dashboard';
import Setting from './pages/Setting';
import NotFound from './pages/NotFound';
import {getToken, removeToken} from './utils/auth'
import Login from "./pages/Login";
import MeiTuanList from "./pages/MeiTuanList";
import MeiTuanSpuList from "./pages/MeiTuanSpuList";
import BreadcrumbNav from "./components/BreadcrumbNav";
import ElemeSpuList from "./pages/ElemeSpuList";
import ElemeList from "./pages/ElemeList";

import 'antd/lib/button/style/index.css';
import 'antd/lib/layout/style/index.css';
import 'antd/lib/spin/style/index.css';

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
              <BreadcrumbNav />
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
              <Route path="/meituan/spuList/:shop_id/:spu_id" component={MeiTuanSpuList} />
              <Route path="/meituan" component={MeiTuanList} />
              <Route path="/eleme/spuList/:shop_id/:spu_id" component={ElemeSpuList} />
              <Route path="/eleme" component={ElemeList} />
              <Route path="/settings" component={Setting} />
              <Redirect from="/login" to="/" />
              <Route component={NotFound} />
            </Switch>
          </Content>

          {/*/!* 页脚 *!/*/}
          {/*<Footer style={{ textAlign: 'center' }}>*/}
          {/*  后台管理系统 ©{new Date().getFullYear()}*/}
          {/*  Created with React {React.version} & Ant Design*/}
          {/*</Footer>*/}
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
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '100%',
  paddingLeft: '15px'
}

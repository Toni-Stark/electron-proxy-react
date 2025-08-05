import React, { Component } from 'react';
import { Layout } from 'antd';
import { Route, Switch } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import UserList from './pages/UserList';
import Setting from './pages/Setting';
import NotFound from './pages/NotFound';

const { Content, Footer } = Layout;

class App extends Component {
  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        {/* 左侧菜单 */}
        <Sidebar />
        
        {/* 右侧内容区 */}
        <Layout>
          <Content style={{ 
            margin: '24px 16px', 
            padding: 24, 
            background: '#fff', 
            minHeight: 280 
          }}>
            {/* 路由配置 */}
            <Switch>
              <Route exact path="/" component={Dashboard} />
              <Route path="/users" component={UserList} />
              <Route path="/settings" component={Setting} />
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

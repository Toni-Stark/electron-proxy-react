import React, { Component } from 'react';
import Layout from 'antd/lib/layout'
import Spin from 'antd/lib/spin'
import {Redirect, Route, Switch, withRouter} from 'react-router-dom';
import Sidebar from './components/Sidebar/index';
import Dashboard from './pages/Dashboard';
import Setting from './pages/Setting';
import NotFound from './pages/NotFound';
import {getToken, removeStorage, removeToken} from './utils/auth'
import Login from "./pages/Login";
import MeiTuanSpuList from "./pages/MeiTuanSpuList";
import ElemeSpuList from "./pages/ElemeSpuList";

import 'antd/lib/button/style/index.css';
import 'antd/lib/modal/style/index.css';
import 'antd/lib/layout/style/index.css';
import 'antd/lib/spin/style/index.css';
import EditableTagGroup from "./components/EditableTagGroup";
import './index.css'
import Modal from "antd/lib/modal";

const { Content, Header } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      links: [
        {
          title: '控制台',
          key: '/',
          hash: ''
        }
      ],
      active: 0,
      isAuthenticated: !!getToken()
    };
    this.updateLinks = this.updateLinks.bind(this)
    this.getOut = this.getOut.bind(this)
  }
   async regLoginStatus(){
     let token = getToken();
     const res = await window.drugApi.userLogin(token)
     if(res.code != 200){
       this.getOut();
       return;
     }
   }
  async componentDidMount() {
    console.log(process.env.NODE_ENV)
    const res = await window.drugApi.isAdmin()
    if(process.env.NODE_ENV === 'production' && !res ){
      Modal.info({
        title: '请使用管理员身份运行此工具!',
        okText: '确认',
        cancelButtonProps: { style: { display: 'none' } },
        onOk() {
          window.close();
        },
      });
    }
    await this.regLoginStatus()
  }
  // 登录状态变更处理
  handleAuthChange = (isAuthenticated) => {
    this.setState({ isAuthenticated });
  };
  getOut = () => {
    removeToken()
    removeStorage('expired_time')
    this.setState({
      isAuthenticated: !!getToken(),
      links:[
        {
          title: '控制台',
          key: '/',
          hash: ''
        }
      ]
    })
  }
  updateLinks = ({type, key, hash, name}) => {
    let list = [...this.state.links];
    if(type === 'del' ){
      list = list.filter(item => !(item.key === key && item.hash === hash));
      let index = this.state.links.findIndex(item => item.key+item.hash === key+hash);
      let nowIndex = this.state.active;
      if(nowIndex === index){
        nowIndex = index>0 ? index-1 : index;
      } else if(nowIndex > index){
        nowIndex--;
      }
      this.setState({ links: [...list], active: nowIndex });
      let link = list[nowIndex].key;
      if(list[nowIndex].hash){
        link += hash;
      }
      this.props.history.push(link);
    }
    if(type === 'add') {
      let index = list.findIndex(item => item.key+item.hash === key+hash);
      if(index>-1){
        this.setState({ active: index });
        let link = list[index].key;
        if(list[index].hash){
          link += hash;
        }
        this.props.history.push(link);
      }else{
        list.push({
          title: name,
          hash: hash,
          key: key
        });
        let link = key;;
        if(hash){
          link += hash;
        }
        this.props.history.push(link);
        this.setState({ links: [...list],active: list.length - 1 });
      }
    }
  }
  render() {
    const { isAuthenticated, loading, links, active } = this.state;

    if (loading) {
      return (
          <div style={flexFull}>
            <Spin size="large" />
          </div>
      );
    }

    if (!isAuthenticated) {
      return (
          <Switch
            className="switch_style"
          >
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
        <Sidebar addLinks={this.updateLinks} getOut={this.getOut} />

        {/* 右侧内容区 */}
        <Layout>
          <Header value={Header}>
            <div className="header_class">
              <EditableTagGroup active={active} links={links} updateLinks={this.updateLinks} />
            </div>
          </Header>
          <Content style={contentStyle}>
            <Switch>
              <Route exact path="/"
                     component={(props) => (
                         <Dashboard {...props} updateLinks={this.updateLinks} />
                     )} />
              <Route path="/meituan/spuList/:shop_id/:spu_id"
                     component={(props) => (
                         <MeiTuanSpuList {...props} key={`${props.match.params.shop_id}-${props.match.params.spu_id}`}/>
                     )}/>
              <Route path="/eleme/spuList/:shop_id/:spu_id"
                     component={(props) => (
                         <ElemeSpuList {...props} key={`${props.match.params.shop_id}-${props.match.params.spu_id}`}/>
                     )}/>
              <Route path="/settings" component={Setting} />
              <Redirect from="/login" to="/" />
              <Route component={NotFound} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(App);

const flexFull = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }
const contentStyle = {
  margin: '16px',
  padding: '16px 0 16px 16px',
  background: '#fff',
  minHeight: 280
}

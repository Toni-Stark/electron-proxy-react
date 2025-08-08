import React, { Component } from 'react';

import Button from 'antd/lib/button'
import Input from 'antd/lib/input'
import Tag from 'antd/lib/tag'
import Avatar from 'antd/lib/avatar'
import message from 'antd/lib/message'
import Select from 'antd/lib/select'
import Card from 'antd/lib/card'

import 'antd/lib/card/style/index.css';
import 'antd/lib/select/style/index.css';
import 'antd/lib/button/style/index.css';
import 'antd/lib/input/style/index.css';
import 'antd/lib/tag/style/index.css';
import 'antd/lib/avatar/style/index.css';
import 'antd/lib/message/style/index.css';

import {getTimes} from "../utils/tools";
import ImagePreviewModal from "../components/ImagePreview";

import '../styles/Dashboard.css'

const { Search } = Input;
const { Option } = Select;

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      total: 0,
      kw: '',
      page: 1,
      refresh: false,
      visible: false,
      drawInfo: {},
      showPreview: false,
      currentImage: '',
      value: ''
    }
    this.getDataList = this.getDataList.bind(this); // 手动绑定
    this.refreshFun = this.refreshFun.bind(this); // 手动绑定
    this.handleChange = this.handleChange.bind(this); // 手动绑定
  }
  async getDataList({page,platform = "", kw = ''}){
    const res = await window.drugApi.storeList(kw,platform, page)
    console.log('当前数据列表:', res);
    let list = res.data.store_list.map((item, index)=>{
      return {...item, key: index+'' ,updatedAt: getTimes(item.updatedAt, 2) }
    })
    this.setState({
      dataList: list,
      total: res.data.total,
      page: page,
      kw: kw
    })
  }
  refreshFun = async() => {
    this.setState({ refresh: true, kw: '' });
    await this.getDataList({ page: 1, platform: this.state.value})
    message.success('刷新成功');
    this.setState({ refresh: false });
  }

  naviToSpuList = (info) => {
    if(info.platform === 'meituan'){
      this.props.updateLinks({type: 'add', key: '/meituan/spuList', name: info.name, hash: `/${info.id}/${info.brand_id}`});
    } else if (info.platform === 'eleme'){
      this.props.updateLinks({type: 'add', key: '/eleme/spuList', name: info.name, hash: `/${info.id}/${info.brand_id}`});
    }
  }
  onClose = () => {
    this.setState({
      visible: false,
      drawInfo: {}
    });
  }
  async componentDidMount() {
    await this.getDataList({ page: 1, platform: this.state.value})
  }
  handleSearch = async (e) => {
    await this.getDataList({kw: e, platform: this.state.value})
  }
  changeTable = async (e) => {
    await this.getDataList({kw: this.state.kw, page: e, platform: this.state.value})
  }
  showPreview = (imgUrl) => {
    this.setState({
      showPreview: true,
      currentImage: imgUrl
    });
  };
  async handleChange(value) {
    this.setState({ value });
    await this.getDataList({kw: this.state.kw, platform: value})
  }
  closePreview = () => {
    this.setState({ showPreview: false});
  };
  render() {
    // 表格列定义
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
      },
      // {
      //   title: '所属平台',
      //   dataIndex: 'platform',
      //   key: 'platform',
      // },
      {
        title: '品牌id',
        dataIndex: 'brand_id',
        key: 'brand_id',
      },
      // {
      //   title: '店铺三方id',
      //   dataIndex: 'third_id',
      //   key: 'third_id',
      // },
      {
        title: '店铺名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '店铺图片',
        dataIndex: 'logo',
        key: 'logo',
        render: (logo) => {
          return <Avatar onClick={()=>this.showPreview(logo)} shape="square" src={logo} size={40}/>
        },
      },
      {
        title: '店铺地址',
        dataIndex: 'address',
        key: 'address',
        width: "30%",
      },
      {
        title: '更新时间',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
      },
      {
        title: '距离',
        dataIndex: 'distance',
        key: 'distance',
      },
      // {
      //   title: '宣传语',
      //   dataIndex: 'slogan',
      //   key: 'slogan',
      // },

      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (status) => {
          let color = status === 1 ? 'green' : 'red';
          return <Tag color={color}>{status === 1 ? '正常' : '异常'}</Tag>;
        },
      },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 200,
        render: (info, record) => (
            <div size="middle" style={{display: 'flex'}}>
              <Button type="link" onClick={()=>this.naviToSpuList(info)}>商品列表</Button>
            </div>
        ),
      },
    ];
    const {dataList,value, refresh, currentImage,showPreview} = this.state;

    return (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: 0
          }}>
            <Select defaultValue={value} style={{ width: 120 }} onChange={this.handleChange}>
              <Option value="">全部</Option>
              <Option value="meituan">美团</Option>
              <Option value="eleme">饿了么</Option>
            </Select>
            <Search
                style={{minWidth: 280,width: 280, marginLeft: 10}}
                placeholder="搜索店铺名称"
                enterButton="确 定"  // 关键修改
                onSearch={this.handleSearch}
            />
            <Button
                style={{width: 80, marginLeft: 10}}
                type="primary"
                block
                loading={refresh}
                onClick={this.refreshFun}
            >
              刷新
            </Button>
          </div>
          <div className="content">
            {
              dataList.map((item, index)=>(
                  <div className="card" key={ index} onClick={()=>this.naviToSpuList(item)}>
                    <div className="title">
                      <div className="main">
                        <div className="avatar_view">
                          <Avatar onClick={()=>this.showPreview(item.logo)} shape="square" src={item.logo} size={40}/>
                        </div>
                        <div className="avatar_title">
                          {item.name}
                        </div>
                      </div>
                    </div>

                    <div style={{marginTop: 6}}>
                      {
                        item.platform === 'meituan' ?
                            (<Tag color="#ffbc26">品牌ID: {item.brand_id}</Tag>) :
                            (<Tag color="#028bf1">品牌ID: {item.brand_id}</Tag>)
                      }
                      <Tag color={item.status === 1 ? 'green' : 'red'}>状态: {item.status === 1 ? '正常' : '异常'}</Tag>
                    </div>
                    <div className="middle_label">店铺地址：<span>{item.address}</span></div>
                    <div className="flex_label">
                      <div className="middle_label">更新时间：<span>{item.updatedAt}</span></div>
                      {item?.distance?<div className="middle_label">距离：<span>{item.distance}</span></div>:null}
                    </div>
                    <div className="posi_right"><div className="text">{item.id}</div></div>
                  </div>
              ))
            }
          </div>
          <ImagePreviewModal
              visible={showPreview}
              imageUrl={currentImage}
              onClose={this.closePreview}
          />
        </div>
    );
  }
}

export default Dashboard;

import React, { Component } from 'react';

import Button from 'antd/lib/button'
import Input from 'antd/lib/input'
import Tag from 'antd/lib/tag'
import Avatar from 'antd/lib/avatar'
import message from 'antd/lib/message'
import Select from 'antd/lib/select'
import Divider from "antd/lib/divider";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Modal from "antd/lib/modal";
import Empty from "antd/lib/empty";
import Pagination from "antd/lib/pagination";

import 'antd/lib/empty/style/index.css';
import 'antd/lib/pagination/style/index.css';
import 'antd/lib/modal/style/index.css';
import 'antd/lib/divider/style/index.css';
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
const { confirm } = Modal;


const DescriptionItem = ({ title, content }) => (
    <div
        style={{
          fontSize: 14,
          lineHeight: '22px',
          marginBottom: 7,
          color: 'rgba(0,0,0,0.65)',
        }}
    >
      <p
          style={{
            marginRight: 8,
            marginBottom: 0,
            display: 'inline-block',
            color: 'rgba(0,0,0,0.85)',
          }}
      >
        {title}:
      </p>
      {content}
    </div>
);
const getPlatformText = (platform) => {
  if(platform === 'meituan'){
    return <div className="posi_right meituan"><div className="text">美团</div></div>;
  } else if (platform === 'eleme'){
    return <div className="posi_right eleme"><div className="text">饿了么</div></div>;
  }
};
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
      value: '',
    }
    this.getDataList = this.getDataList.bind(this); // 手动绑定
    this.refreshFun = this.refreshFun.bind(this); // 手动绑定
    this.handleChange = this.handleChange.bind(this); // 手动绑定
    this.showDetailStore = this.showDetailStore.bind(this); // 手动绑定
    this.showConfirm = this.showConfirm.bind(this); // 手动绑定
    this.changeTable = this.changeTable.bind(this); // 手动绑定
  }
  async getDataList({page,platform = "", kw = ''}){
    const res = await window.drugApi.storeList(kw,platform, page)
    let list = res.data.store_list.map((item, index)=>{
      return {...item, key: index+'' ,updatedAt: getTimes(item.updatedAt, 2) }
    })
    this.setState({
      dataList: [...list],
      total: res.data.total,
      page: page,
      kw: kw
    })
  }
  refreshFun = async() => {
    this.setState({ refresh: true });
    await this.getDataList({ page: 1, platform: this.state.value, kw: this.state.kw})
    message.success('刷新成功');
    this.setState({ refresh: false });
  }

  naviToSpuList = (info) => {
    const shop_name = info.platform === 'meituan' 
      ? '[美团]' + info.name
      : '[饿了么]' + info.name
    if(info.platform === 'meituan'){
      this.props.updateLinks({type: 'add', key: '/meituan/spuList', name: shop_name, hash: `/${info.id}/${info.brand_id}`});
    } else if (info.platform === 'eleme'){
      this.props.updateLinks({type: 'add', key: '/eleme/spuList', name: shop_name, hash: `/${info.id}/${info.brand_id}`});
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
  showPreview = (e, imgUrl) => {
    e.preventDefault();  // 阻止默认行为
    e.stopPropagation(); // 阻止冒泡
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

  showDetailStore = async (e, id) => {
    e.preventDefault();  // 阻止默认行为
    e.stopPropagation(); // 阻止冒泡
    const res = await window.drugApi.storeInfo(id);
    const data = {
      ...res.data,
      createdAt: getTimes(res.data.createdAt),
      updatedAt: getTimes(res.data.updatedAt),
    }
    this.setState({
      visible: true,
      drawInfo: data
    })
  }
  showConfirm = async (e, item) => {
    let that = this;
    e.preventDefault();  // 阻止默认行为
    e.stopPropagation(); // 阻止冒泡
    await confirm({
      title: `删除店铺`,
      content: `确认删除${item.name}？`,
      okText: '确认',
      cancelText: '取消',
      async onOk() {
        const res = await window.drugApi.storeDel(item.id);
        if(res.code === 200){
          await that.getDataList({ page:that.state.page, platform: that.state.value, kw: that.state.kw})
          message.success('删除成功')
        } else {
          message.error(res.message);
        }
      },
      onCancel() {},
    });
  }
  render() {
    const {dataList,value, refresh,visible,drawInfo, currentImage,showPreview,page, total} = this.state;

    return (
        <div style={divStyle}>
          <div style={{display: 'flex', alignItems: 'center', padding: 0}}>
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
              dataList.map((item, index)=> {
                return (
                  <div className="card" key={item.id + item.brand_id + index} onClick={(e)=>this.showDetailStore(e,item.id)}>
                    <div className="title">
                      <div className="main">
                        <div className="avatar_view">
                          <Avatar onClick={(e)=>this.showPreview(e, item.logo)} shape="square" src={item.logo} size={40}/>
                        </div>
                        <div className="avatar_title">
                          {item.name}
                        </div>
                      </div>
                    </div>
                    <div className="content_view">
                      <div className="content_tag">
                        <Tag color="#028bf1">品牌ID: {item.brand_id}</Tag>
                        <Tag color={item.status === 1 ? 'green' : 'red'}>状态: {item.status === 1 ? '正常' : '异常'}</Tag>
                      </div>
                      <div className="middle_label">店铺地址：<span>{item.address}</span></div>
                      <div className="flex_label">
                        <div className="middle_label">更新时间：<span>{item.updatedAt}</span></div>
                        {item?.distance?<div className="middle_label">距离：<span>{item.distance}</span></div>:null}
                      </div>
                      {getPlatformText(item.platform)}
                    </div>
                    <div className="footer_view">
                      <Button className="button link" type="link" onClick={(e)=>this.naviToSpuList(item)}>商品详情</Button>
                      <Button className="button danger" type="danger" onClick={(e)=>this.showConfirm(e,item)}>删除</Button>
                    </div>
                  </div>
                )
              })
            }
          </div>
          {total>0 ?
              <div style={pageStyle}>
                <Pagination
                    defaultCurrent={page}
                    total={total}
                    size="small"
                    pageSize={30}
                    showTotal={total => `共 ${total} 条`}
                    onChange={this.changeTable} />
              </div>
              : <div style={empty}><Empty description="暂无数据"/></div>}
          <Modal
              width="60%"
              closable={false}
              onClose={this.onClose}
              visible={visible}
              footer={[
                <Button key="cancel" onClick={this.onClose}>
                  关闭
                </Button>
              ]}
          >
            <div style={titleStyle}>
              <Avatar src={drawInfo.logo} size={50} style={{marginRight: 10}}/>
              <p style={evalStyle}>{drawInfo.name}</p>
            </div>
            <Divider />
            <Row>
              <Col span={24}>
                <DescriptionItem title="店铺地址" content={drawInfo.address} />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <DescriptionItem title="品牌id" content={drawInfo.brand_id} />
              </Col>
              <Col span={12}>
                <DescriptionItem title="距离" content={drawInfo.distance} />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <DescriptionItem title="创建时间" content={drawInfo.createdAt} />
              </Col>
              <Col span={12}>
                <DescriptionItem title="更新时间" content={drawInfo.updatedAt} />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <DescriptionItem title="宣传语" content={drawInfo.slogan}/>
              </Col>
            </Row>
          </Modal>
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

const evalStyle = {fontSize: 25, display: 'block', margin: 0, lineHeight: '50px'};
const titleStyle = {display: 'flex', alignItems: 'center'};
const pageStyle = {display: 'flex', padding: '20px 0', justifyContent: 'center', width: '100%'}
const empty = {height:350,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}
const divStyle = {height: '100%', overflowY: 'auto', paddingRight: '10px'}

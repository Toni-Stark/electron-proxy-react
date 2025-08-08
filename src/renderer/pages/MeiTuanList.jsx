import React, { Component } from 'react';

import Table from 'antd/lib/table'
import Button from 'antd/lib/button'
import Input from 'antd/lib/input'
import Tag from 'antd/lib/tag'
import Avatar from 'antd/lib/avatar'
import message from 'antd/lib/message'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Divider from 'antd/lib/divider'
import Drawer from 'antd/lib/drawer'

import 'antd/lib/table/style/index.css';
import 'antd/lib/button/style/index.css';
import 'antd/lib/input/style/index.css';
import 'antd/lib/tag/style/index.css';
import 'antd/lib/avatar/style/index.css';
import 'antd/lib/message/style/index.css';
import 'antd/lib/divider/style/index.css';
import 'antd/lib/drawer/style/index.css';


import {getTimes} from "../utils/tools";
import ImagePreviewModal from "../components/ImagePreview";

const { Search } = Input;

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
            display: 'inline-block',
            color: 'rgba(0,0,0,0.85)',
          }}
      >
        {title}:
      </p>
      {content}
    </div>
);

class MeiTuanList extends Component {
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
    }
    this.getDataList = this.getDataList.bind(this); // 手动绑定
    this.refreshFun = this.refreshFun.bind(this); // 手动绑定
  }
  async getDataList({page, kw = ''}){
    const res = await window.drugApi.storeList(kw,'meituan', page)
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
    await this.getDataList({ page: 1})
    message.success('刷新成功');
    this.setState({ refresh: false });
  }
  showDetail = async (info) => {
    console.log(info);
    const res = await window.drugApi.storeInfo(info.id);
    console.log(res,'res')
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
  naviToSpuList = (info) => {
    this.props.history.push(`/meituan/spuList/${info.id}/${info.brand_id}`)
  }
  onClose = () => {
    this.setState({
      visible: false,
      drawInfo: {}
    });
  }
  async componentDidMount() {
    await this.getDataList({ page: 1})
  }
  handleSearch = async (e) => {
    await this.getDataList({kw: e})
  }
  changeTable = async (e) => {
    await this.getDataList({kw: this.state.kw, page: e})
  }
  showPreview = (imgUrl) => {
    this.setState({
      showPreview: true,
      currentImage: imgUrl
    });
  };
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
              <Button onClick={()=>this.showDetail(info)}>详情</Button>
              <Button type="link" onClick={()=>this.naviToSpuList(info)}>商品列表</Button>
            </div>
        ),
      },
    ];
    const {dataList, refresh, visible, drawInfo, page, total,currentImage,showPreview} = this.state;

    return (
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: 0
        }}>
          <Search
              style={{minWidth: 280,width: 280}}
              placeholder="搜索店铺名称和地址"
              enterButton
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
        <Table
            style={{marginTop: 10}}
            columns={columns}
            size="middle"
            scroll={dataList.length> 0 ? { x: 1300, y: 'calc(100vh - 300px)' }: {}}
            pagination={{
              position: 'bottom',
              pageSize: 30,
              current: page,
              total: total,
              showTotal: total => `共 ${total} 条`,
              onChange: this.changeTable,  // 页码改变回调
            }}
            dataSource={dataList}
        />
        <Drawer
            width={640}
            placement="right"
            closable={false}
            onClose={this.onClose}
            visible={visible}
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
        </Drawer>
        <ImagePreviewModal
            visible={showPreview}
            imageUrl={currentImage}
            onClose={this.closePreview}
        />
      </div>
    );
  }
}

export default MeiTuanList;

const pStyle = {
  fontSize: 16,
  color: 'rgba(0,0,0,0.85)',
  lineHeight: '24px',
  display: 'block',
  marginBottom: 16,
  fontWeight: 'bold'
};
const evalStyle = {
  fontSize: 25,
  display: 'block',
  margin: 0,
  lineHeight: '50px'
};
const titleStyle = {
  display: 'flex',
  alignItems: 'center',
};

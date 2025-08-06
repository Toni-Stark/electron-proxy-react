import React, { Component } from 'react';
import {Card, Table, Button, Input, Tag, Icon, Avatar, message, Row, Col, Divider, Drawer} from 'antd';
import {Link} from "react-router-dom";

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
  state = {
    dataList: [],
    total: 0,
    page: 1,
    refresh: false,
    visible: false,
    drawInfo: {}
  }
  async getDataList({page}){
    const res = await window.drugApi.storeList('','meituan', page)
    console.log('当前数据列表:', res);
    let list = res.data.store_list.map((item, index)=>{
      return {...item, key: index+''}
    })
    this.setState({
      dataList: list,
      total: res.data.total,
      page: page,
    })
  }
  refreshFun = async() => {
    this.setState({ refresh: true });
    await this.getDataList({ page: 1})
    message.success('刷新成功');
    this.setState({ refresh: false });
  }
  showDetail = async (info, record) => {
    console.log(info, record, 'record');
    const res = await window.drugApi.storeInfo(info.id);
    console.log(res,'res')
    this.setState({
      visible: true,
      drawInfo: res.data
    })
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

  render() {
    // 表格列定义
    const columns = [
      {
        title: '店铺自增id',
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
          return <Avatar src={logo} size={40}/>
        },
      },
      // {
      //   title: '店铺地址',
      //   dataIndex: 'address',
      //   key: 'address',
      // },
      {
        title: '距离',
        dataIndex: 'distance',
        key: 'distance',
      },
      {
        title: '宣传语',
        dataIndex: 'slogan',
        key: 'slogan',
      },

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
        render: (text, record) => (
            <div size="middle" style={{display: 'flex'}}>
              <Tag color="blue" onClick={()=>this.showDetail(text,record)}><Icon type="info-circle" theme="twoTone" />详情</Tag>
              <Tag color="geekblue"><Link to="/meituan/spu?">SPU</Link></Tag>
            </div>
        ),
      },
    ];
    const {dataList, refresh, visible, drawInfo} = this.state;

    return (
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 0
        }}>
          <Search style={{minWidth: 280,width: 280}} placeholder="搜索店铺名称和地址" enterButton />
          <Button
              style={{width: 100}}
              type="primary"
              block
              loading={refresh}
              onClick={this.refreshFun}
          >
            刷新
          </Button>
        </div>
        <Table style={{marginTop: 10}} columns={columns} dataSource={dataList} />
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

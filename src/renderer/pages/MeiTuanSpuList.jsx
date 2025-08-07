import React, { Component } from 'react';
import {Card, Table, Button, Input, Tag, Icon, Avatar, message, Row, Col, Divider, Drawer} from 'antd';
import {getTimes} from "../utils/tools";
import ImagePreviewModal from "../components/ImagePreview";
import '../styles/MeiTuanSpuList.css'

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

class MeiTuanSpuList extends Component {
  state = {
    dataList: [],
    total: 0,
    kw: '',
    page: 1,
    refresh: false,
    visible: false,
    drawInfo: {},
    showPreview: false,
    currentImage: '',
    spu_id: '',
    shop_id: '',
  }
  async getDataList({spu_id, shop_id, page, kw = '',is_export = 0}){
    let spu = spu_id || this.state.spu_id;
    let shop = shop_id || this.state.shop_id;
    const res = await window.drugApi.getSkuList(shop, spu, kw, page, is_export)
    let list = res.data.sku_list.map((item, index)=>{
      return {...item, key: index+1+''}
    })
    console.log(spu, shop, 'lg')
    this.setState({
      dataList: list,
      total: res.data.total,
      page: page,
      kw: kw,
      shop_id: shop,
      spu_id: spu,
    })
  }

  async uploadAllData(){
    let spu = this.state.spu_id;
    let shop = this.state.shop_id;
    this.setState({
      loading: true
    })
    const res = await window.drugApi.getSkuList(shop, spu, '', 1, 1)
    console.log(res, 'res')
    this.setState({
      loading: false
    })
  }
  refreshFun = async() => {
    this.setState({ refresh: true });
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
      updatedAt: getTimes(res.data.createdAt),
  }
    this.setState({
      visible: true,
      drawInfo: data
    })
  }
  naviToSpuList = async (info) => {
    this.props.history.push(`/meituan/spuList/${info.id}/${info.brand_id}`)
  }
  onClose = () => {
    this.setState({
      visible: false,
      drawInfo: {}
    });
  }

  async componentDidMount() {
    const { shop_id, spu_id } = this.props.match.params;
    console.log(shop_id, spu_id, 'id')
    await this.getDataList({spu_id, shop_id, page: 1})
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
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        width: 55
      },
      {
        title: '店铺名称',
        dataIndex: 'shop_name',
        key: 'shop_name',
        width: 100
      },
      {
        title: '店铺地址',
        dataIndex: 'shop_address',
          key: 'shop_address',
          width: 200
      },
      {
        title: '店铺logo',
        dataIndex: 'shop_picture',
        key: 'shop_picture',
        render: (logo) => {
          return <Avatar onClick={()=>this.showPreview(logo)} shape="square" src={logo} size={40}/>
        },
        width: 65
      },
      {
        title: '药品名称',
        dataIndex: 'product_name',
        key: 'product_name',
        width: 200
      },
      {
        title: '药品图片',
        dataIndex: 'spu_picture',
        key: 'spu_picture',
        render: (logo) => {
          return <Avatar onClick={()=>this.showPreview(logo)} shape="square" src={logo} size={40}/>
        },
        width: 65
      },
      {
        title: '规格标签',
        dataIndex: 'sku_label',
        key: 'sku_label',
        width: 200
      },
      {
        title: '规格名称',
        dataIndex: 'sku_name',
        key: 'sku_name',
        width: 150
      },
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
        width: 42,
      },
      {
        title: '原价',
        dataIndex: 'origin_price',
        key: 'origin_price',
        width: 42,
      },
      {
        title: '库存',
        dataIndex: 'stock',
        key: 'stock',
        width: 42,
      },
      {
        title: 'sku图片',
        dataIndex: 'sku_picture',
        key: 'sku_picture',
        render: (logo) => {
          return <Avatar onClick={()=>this.showPreview(logo)} shape="square" src={logo} size={40}/>
        },
        width: 65
      },
      {
        title: '最小购买数',
        dataIndex: 'min_order_count',
        key: 'min_order_count',
        width: 65,
      },
      // {
      //   title: '操作',
      //   key: 'action',
      //   fixed: 'right',
      //   width: 100,
      //   render: (info, record) => (
      //       <div size="middle" style={{display: 'flex'}}>
      //         <Button onClick={()=>this.showDetail(info)}>详情</Button>
      //       </div>
      //   ),
      // },
    ];
    const {dataList, refresh, visible, drawInfo, page, total, loading,currentImage,showPreview} = this.state;

    return (
      <div>
        <div style={{...flexView,justifyContent: 'space-between'}}>
          <div style={flexView}>
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
          <Button
              style={{width: 80, marginLeft: 10}}
              type="primary"
              block
              loading={loading}
              onClick={()=>this.uploadAllData(this)}
          >
            导出
          </Button>
        </div>
        <Table
            style={{marginTop: 10}}
            columns={columns}
            size="middle"
            scroll={{ x: 1300, y: 'calc(100vh - 300px)' }}
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

export default MeiTuanSpuList;

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
const flexView = {
  display: 'flex',
  alignItems: 'center',
  padding: 0
}

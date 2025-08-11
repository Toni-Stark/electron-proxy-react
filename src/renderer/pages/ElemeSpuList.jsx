import React, { Component } from 'react';
import ImagePreviewModal from "../components/ImagePreview";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


import Table from 'antd/lib/table'
import Button from 'antd/lib/button'
import Input from 'antd/lib/input'
import Avatar from 'antd/lib/avatar'
import message from 'antd/lib/message'

import 'antd/lib/table/style/index.css';
import 'antd/lib/button/style/index.css';
import 'antd/lib/input/style/index.css';
import 'antd/lib/avatar/style/index.css';
import 'antd/lib/message/style/index.css';


import '../styles/MeiTuanSpuList.css'

const { Search } = Input;


const columnsKeys = {
    // shop_name: '店铺名称',
    // shop_address: '店铺地址',
    // shop_picture: '店铺logo',
    product_name: '药品名称',
    // spu_picture: '药品图片',
    sku_label: '规格标签',
    sku_name: '规格名称',
    price: '价格',
    origin_price: '原价',
    stock: '库存',
    // sku_picture: 'sku图片',
    min_order_count: '最小购买数',
}
const handleExport = async (fileName, data) => {
  try {
    if (!data || data.length === 0) {
      message.warning('没有可导出的数据');
      return;
    }

    // 1. 准备数据 - 确保顺序与columnsKeys一致
    const columnOrder = Object.keys(columnsKeys);
    const chineseHeaders = Object.values(columnsKeys);

    // 2. 重新组织数据，只包含columnsKeys中定义的字段
    const filteredData = data.map(item => {
      const newItem = {};
      columnOrder.forEach(key => {
        newItem[key] = item[key]; // 保留原始键名
      });
      return newItem;
    });

    // 3. 创建工作簿和工作表
    const wb = XLSX.utils.book_new();

    // 4. 先创建工作表（使用原始键名）
    const worksheet = XLSX.utils.json_to_sheet(filteredData, {
      header: columnOrder // 使用原始键名作为header
    });

    // 5. 替换表头为中文（必须在创建工作表后）
    XLSX.utils.sheet_add_aoa(worksheet, [chineseHeaders], { origin: "A1" });

    // 6. 添加到工作簿
    XLSX.utils.book_append_sheet(wb, worksheet, "数据");

    // 7. 生成文件并下载
    const excelBuffer = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    await saveAs(blob, fileName || `导出数据_${new Date().toISOString().slice(0, 10)}.xlsx`)
    message.success('导出成功');
  } catch (error) {
    console.error('导出失败:', error);
    message.error('导出失败: ' + error.message);
  }
};

class ElemeSpuList extends Component {
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
      spu_id: '',
      shop_id: '',
    };
    this.getDataList = this.getDataList.bind(this); // 手动绑定
    this.uploadAllData = this.uploadAllData.bind(this); // 手动绑定
    this.refreshFun = this.refreshFun.bind(this); // 手动绑定
    this.changeTable = this.changeTable.bind(this); // 手动绑定
  }

  async getDataList({spu_id, shop_id, page, kw = '',is_export = 0}){
    let spu = spu_id || this.state.spu_id;
    let shop = shop_id || this.state.shop_id;
    const res = await window.drugApi.getSkuList(shop, spu, kw, page, is_export)
    let list = res.data.sku_list.map((item, index)=>{
      return {...item, key: index+1+''}
    })
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
    let list = res.data?.sku_list;
    if(list?.length<=0){
      message.warning('没有可导出的数据')
      return;
    }
    await handleExport(list[0].shop_name,list)
    this.setState({
      loading: false
    })
  }
  refreshFun = async() => {
    this.setState({ refresh: true });
    await this.getDataList({ page: 1, kw: this.state.kw})
    message.success('刷新成功');
    this.setState({ refresh: false });
  }
  onClose = () => {
    this.setState({
      visible: false,
      drawInfo: {}
    });
  }

  async componentDidMount() {
    const { shop_id, spu_id } = this.props.match.params;
    await this.getDataList({shop_id, page: 1})
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
      // {
      //   title: '序号',
      //   dataIndex: 'key',
      //   key: 'key',
      //   width: 28
      // },
      // {
      //   title: '店铺名称',
      //   dataIndex: 'shop_name',
      //   key: 'shop_name',
      //   width: 100
      // },
      // {
      //   title: '店铺地址',
      //   dataIndex: 'shop_address',
      //     key: 'shop_address',
      //     width: 200
      // },
      // {
      //   title: '店铺logo',
      //   dataIndex: 'shop_picture',
      //   key: 'shop_picture',
      //   render: (logo) => {
      //     return <Avatar onClick={()=>this.showPreview(logo)} shape="square" src={logo} size={40}/>
      //   },
      //   width: 65
      // },
      {
        title: '药品图片',
        dataIndex: 'spu_picture',
        key: 'spu_picture',
        render: (logo) => {
          return <Avatar onClick={()=>this.showPreview(logo)} shape="square" src={logo} size={40}/>
        },
        width: 55,
        minWidth: 55,
        maxWidth: 55
      },
      {
        title: '药品名称',
        dataIndex: 'product_name',
        key: 'product_name',
        width: 200
      },
      {
        title: '规格标签',
        dataIndex: 'sku_label',
        key: 'sku_label',
        width: 90
      },
      {
        title: '规格名称',
        dataIndex: 'sku_name',
        key: 'sku_name',
        width: 90
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
      // {
      //   title: 'sku图片',
      //   dataIndex: 'sku_picture',
      //   key: 'sku_picture',
      //   render: (logo) => {
      //     return <Avatar onClick={()=>this.showPreview(logo)} shape="square" src={logo} size={40}/>
      //   },
      //   width: 65
      // },
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
    const {dataList, refresh,page, total, loading,currentImage,showPreview} = this.state;

    return (
      <div style={divStyle}>
        <div style={{...flexView,justifyContent: 'space-between'}}>
          <div style={flexView}>
            <Search
                style={{minWidth: 280,width: 280}}
                placeholder="请输入药品名称"
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
            locale={{ emptyText: '暂无数据' }}
            pagination={{
              position: 'bottom',
              pageSize: 30,
              current: page,
              total: total,
              showTotal: total => `共 ${total} 条`,
              onChange: this.changeTable,  // 页码改变回调
            }}
            scroll={dataList.length> 0 ?{
              y: 'calc(100vh - 240px)', // 动态计算高度（视窗高度 - 其他元素高度）
              x: '100%' // 保持横向滚动
            }:{}}
            dataSource={dataList}
        />
        <ImagePreviewModal
            visible={showPreview}
            imageUrl={currentImage}
            onClose={this.closePreview}
        />
      </div>
    );
  }
}

export default ElemeSpuList;

const flexView = {display: 'flex', alignItems: 'center', padding: 0}
const divStyle = {paddingRight: '10px'}


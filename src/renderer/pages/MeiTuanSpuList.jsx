import React, { Component } from 'react';
import ImagePreviewModal from "../components/ImagePreview";
import * as XLSX from 'xlsx';
import saveAs from 'file-saver';
import { getTimes, formatDate } from '../utils/tools';

import Table from 'antd/lib/table'
import Button from 'antd/lib/button'
import Input from 'antd/lib/input'
import Avatar from 'antd/lib/avatar'
import message from 'antd/lib/message'
import Tag from 'antd/lib/tag'
import Select from 'antd/lib/select'

import 'antd/lib/table/style/index.css';
import 'antd/lib/button/style/index.css';
import 'antd/lib/input/style/index.css';
import 'antd/lib/avatar/style/index.css';
import 'antd/lib/message/style/index.css';
import 'antd/lib/tag/style/index.css';
import 'antd/lib/select/style/index.css';


import '../styles/MeiTuanSpuList.css'

const { Search } = Input;


const handleExport = async (fileName, data) => {
  // 仅仅用于导出.
  const columnsKeys = {
    product_name: '药品名称',
    tag_name: '分类',
    month_saled: '月售',
    sku_label: '规格标签',
    sku_name: '规格名称',
    upccode: '69码',
    price: '价格',
    origin_price: '原价',
    stock: '库存',
    updated_time: '更新时间'
  }

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

class MeiTuanSpuList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      cate_list: [],
      total: 0,
      kw: '',
      page: 1,
      refresh: false,
      visible: false,
      drawInfo: {},
      showPreview: false,
      currentImage: '',
      shop_id: '',
      tag_id: '',
    };
    this.getDataList = this.getDataList.bind(this); // 手动绑定
    this.uploadAllData = this.uploadAllData.bind(this); // 手动绑定
    this.refreshFun = this.refreshFun.bind(this); // 手动绑定
    this.changeTable = this.changeTable.bind(this); // 手动绑定
  }

  async getDataList({tag_id, shop_id, page, kw = '',is_export = 0}){
    let tag = tag_id || this.state.tag_id;
    let shop = shop_id || this.state.shop_id;
    const res = await window.drugApi.getSkuList(shop, tag, kw, page, is_export)
    // 组合数据.
    let list = this.buildRenderData(res.data.render_data).map((item, index) => {
      return {...item, key: index + 1 + ''}
    })

    let cate_res = await window.drugApi.storeCates(shop)
    let cate_list = cate_res.code === 200 ? cate_res.data : []

    this.setState({
      dataList: [...list],
      total: res.data.total,
      page: page,
      kw: kw,
      shop_id: shop,
      tag_id: tag,
      cate_list: cate_list,
    })
  }

  buildRenderData(spu_list) {
    let product_list = []

    spu_list.map((spu) => {
      spu.sku_items.map((sku, idx) => {
        product_list.push({
          shop_name: spu.shop_name,
          spu_picture: spu.spu_picture,
          product_name: spu.product_name,
          month_saled: spu.month_saled,
          sku_label: spu.sku_label,
          sku_name: sku.sku_name,
          sku_picture: sku.picture,
          stock: sku.stock,
          price: sku.price,
          origin_price: sku.origin_price,
          min_order_count: sku.min_order_count,
          upccode: sku.upccode,
          tag_name: spu.tag_name,
          row_span: idx === 0 && spu.sku_items.length > 1 ? spu.sku_items.length : (spu.sku_items.length === 1 ? 1 : 0),
          updated_time: getTimes(spu.updated_time)
        })
      })
    })

    return product_list
  }

  async uploadAllData(){
    let tag = this.state.tag_id;
    let shop = this.state.shop_id;
    this.setState({
      loading: true
    })
    const res = await window.drugApi.getSkuList(shop, tag, this.state.kw || '', 1, 1)
    let list = this.buildRenderData(res.data.render_data ? res.data.render_data: []);
    if(list?.length<=0){
      message.warning('没有可导出的数据')
      return;
    }
    const filename = ['[美团]' + list[0].shop_name, formatDate(new Date())].join('_') + '.xlsx'
    await handleExport(filename, list)
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

  onSelectChange = (tag_id) => {
    this.setState({
      tag_id: tag_id
    })
  }

  async componentDidMount() {
    const { shop_id, tag_id } = this.props.match.params;
    await this.getDataList({shop_id, page: 1, tag_id})
  }

  handleSearch = async (e) => {
    await this.getDataList({kw: e, tag_id: this.state.tag_id})
  }
  changeTable = async (e) => {
    await this.getDataList({kw: this.state.kw, page: e, tag_id: this.state.tag_id})
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
        title: '药品图片',
        dataIndex: 'spu_picture',
        key: 'spu_picture',
        render: (logo, row) => {
          return {
            children: <Avatar onClick={()=>this.showPreview(logo)} shape="square" src={logo} size={40}/>,
            props: {
              rowSpan: row.row_span || 0
            }
          }
        },
        width: 55,
        minWidth: 55,
        maxWidth: 55
      },
      {
        title: '药品名称',
        dataIndex: 'product_name',
        key: 'product_name',
        width: 250,
        render: (val, row) => {
          return {
            children: (
              <div>
                <div>{val}</div>
                <div>
                  {row.tag_name && <span><Tag color="blue">{row.tag_name}</Tag></span>}
                  {row.upccode && <span><Tag color="green">{row.upccode}</Tag></span>}
                </div>
              </div>
            ),
            props: {
              rowSpan: row.row_span || 0
            }
          }
        },
      },
      {
        title: '月售',
        dataIndex: 'month_saled',
        key: 'month_saled',
        width: 50,
        render: (val, row) => {
          return {
            children: val,
            props: {
              rowSpan: row.row_span || 0
            }
          }
        },
      },
      {
        title: '规格标签',
        dataIndex: 'sku_label',
        key: 'sku_label',
        width: 90,
        render: (val, row) => {
          return {
            children: val,
            props: {
              rowSpan: row.row_span || 0
            }
          }
        },
      },
      {
        title: '规格名称',
        dataIndex: 'sku_name',
        key: 'sku_name',
        width: 90,
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
        title: '更新时间',
        dataIndex: 'updated_time',
        key: 'updated_time',
        width: 100,
      }
    ];

    const {dataList, cate_list, refresh, page, total, loading, currentImage, showPreview} = this.state;

    return (
      <div style={divStyle}>
        <div style={{...flexView,justifyContent: 'space-between'}}>
          <div style={flexView}>
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="请选择分类"
              optionFilterProp="children"
              onChange={this.onSelectChange}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              { cate_list.map((cate) => {
                return <Select.Option key={cate.tag} value={cate.tag}>{cate.tag_text}</Select.Option>
              }) }
            </Select>,
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

export default MeiTuanSpuList;

const flexView = {display: 'flex', alignItems: 'center', padding: 0}
const divStyle = {paddingRight: '10px'}

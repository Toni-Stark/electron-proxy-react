import React, { Component } from 'react';
import {Card, Table, Button, Input, Tag, Icon, Avatar, message} from 'antd';

const { Search } = Input;

class MeiTuanList extends Component {
  state = {
    dataList: [],
    total: 0,
    page: 1,
    refresh: false
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
      {
        title: '店铺地址',
        dataIndex: 'address',
        key: 'address',
      },
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
    ];
    const {dataList, refresh} = this.state;

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
      </div>
    );
  }
}

export default MeiTuanList;

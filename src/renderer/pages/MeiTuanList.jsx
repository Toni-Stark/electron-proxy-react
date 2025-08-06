import React, { Component } from 'react';
import { Card, Table, Button, Input, Tag, Icon } from 'antd';
import {PLATFORM_MEITUAN} from "../../main/services/constants";

const { Search } = Input;

// 用户数据
const userData = [
  {
    key: '1',
    name: '张三',
    age: 32,
    email: 'zhangsan@example.com',
    role: '管理员',
    status: '活跃',
  },
  {
    key: '2',
    name: '李四',
    age: 42,
    email: 'lisi@example.com',
    role: '编辑',
    status: '离线',
  },
  {
    key: '3',
    name: '王五',
    age: 32,
    email: 'wangwu@example.com',
    role: '访客',
    status: '活跃',
  },
  {
    key: '4',
    name: '赵六',
    age: 28,
    email: 'zhaoliu@example.com',
    role: '编辑',
    status: '活跃',
  },
  {
    key: '5',
    name: '钱七',
    age: 36,
    email: 'qianqi@example.com',
    role: '访客',
    status: '禁用',
  },
];

class MeiTuanList extends Component {
  state = {
    dataList: [],
    total: 0,
    page: 1,
  }
  async getDataList({page}){
    const current = await window.drugApi.storeList()
    console.log('当前数据列表:', current)
  }
  async componentDidMount() {
    await this.getDataList({ page: 1})
  }

  render() {
    // 表格列定义
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '角色',
        dataIndex: 'role',
        key: 'role',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (status) => {
          // 根据状态设置不同颜色的标签
          let color = status === '活跃' ? 'green' :
                      status === '离线' ? 'orange' : 'red';
          return <Tag color={color}>{status}</Tag>;
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <div size="middle">
            <a href="#"><Icon type="edit" /></a>
            <a href="#"><Icon type="delete" /></a>
          </div>
        ),
      },
    ];

    return (
      <div>
        <Card>
          <div style={{
            marginBottom: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h2>用户列表</h2>
            <div>
              <Search placeholder="搜索用户" enterButton />
              <Button type="primary">
                <Icon type="plus" /> 新增用户
              </Button>
            </div>
          </div>

          {/* 用户表格 */}
          <Table columns={columns} dataSource={userData} />
        </Card>
      </div>
    );
  }
}

export default MeiTuanList;

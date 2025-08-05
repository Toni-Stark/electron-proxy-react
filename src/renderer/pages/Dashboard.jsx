import React, { Component } from 'react';
import { Card, Statistic, Row, Col, Table, Icon } from 'antd';

// 示例数据
const userData = [
  {
    key: '1',
    name: '张三',
    age: 32,
    address: '北京市朝阳区',
    status: '活跃',
  },
  {
    key: '2',
    name: '李四',
    age: 42,
    address: '上海市静安区',
    status: '离线',
  },
  {
    key: '3',
    name: '王五',
    age: 32,
    address: '广州市天河区',
    status: '活跃',
  },
];

class Dashboard extends Component {
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
        title: '地址',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (status) => (
          <span>
            {status === '活跃' ? (
              <span><Icon type="check-circle" style={{ color: 'green' }} /> 活跃</span>
            ) : (
              <span><Icon type="close-circle" style={{ color: 'red' }} /> 离线</span>
            )}
          </span>
        ),
      },
    ];

    return (
      <div>
        <h2>仪表盘</h2>
        
        {/* 统计卡片 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card>
              <Statistic title="总用户数" value={1258} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="今日活跃" value={246} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="新增用户" value={32} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="总访问量" value={12580} />
            </Card>
          </Col>
        </Row>
        
        {/* 最近活跃用户表格 */}
        <Card title="最近活跃用户">
          <Table columns={columns} dataSource={userData} pagination={false} />
        </Card>
      </div>
    );
  }
}

export default Dashboard;

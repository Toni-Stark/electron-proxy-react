import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Result from 'antd/lib/result'
import Button from 'antd/lib/button'

import 'antd/lib/result/style/index.css';
import 'antd/lib/button/style/index.css';

class NotFound extends Component {
  render() {
    return (
      <Result
        status="404"
        title="404"
        subTitle="抱歉，您访问的页面不存在。"
        extra={<Button type="primary"><Link to="/">返回首页</Link></Button>}
      />
    );
  }
}

export default NotFound;

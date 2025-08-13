import React, { Component } from 'react';

import Card from 'antd/lib/card'
import Form from 'antd/lib/form'
import Switch from 'antd/lib/switch'
import notification from 'antd/lib/notification'

import 'antd/lib/card/style/index.css';
import 'antd/lib/form/style/index.css';
import 'antd/lib/switch/style/index.css';
import 'antd/lib/notification/style/index.css';


const FormItem = Form.Item;

const openMessage = (type, text) => {
  notification[type]({
    message: text,
  });
};

class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      running: false,
      port: 0,
      openProxy: false
    }
    this.updateStatus = this.updateStatus.bind(this); // 手动绑定
  }
  updateStatus = async () => {
    const current = await window.drugApi.getStatus()
    this.setState({
      running: current.running,
      port: current.port,
      openProxy: current.running,
    })
  }
  // 处理表单提交
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('表单提交的值: ', values);
      if (!err) {
        console.log('表单提交的值: ', values);
        // 这里可以添加保存设置的逻辑
      }
    });
  };
  handleImmediateChange = async (key, value) => {
    await this.setState({ [key]: value }, async () => {
      if(key === 'openProxy'){
        if(value){
          const success = await window.drugApi.start()
          if (success) {
            openMessage('success', '启动成功，请正常浏览小程序')
          } else {
            openMessage('error', '启动失败，请以管理员身份运行并安装证书至受信任的根证书颁发机构')
          }
          await this.updateStatus()
        } else {
          const success = await window.drugApi.stop()
          if (success) {
            openMessage('info', '代理已停止')
            await this.updateStatus()
          }
        }
      }
    });
  };
  async componentDidMount() {
    await this.updateStatus()
  }
  render() {
    const { port, running, openProxy } = this.state;
    return (
      <Card title="代理设置">
        <Form onSubmit={this.handleSubmit}>
          <div>
            <div style={flex}>
              <FormItem label="端口" style={flexV}>
                <span className="ant-form-text">{port}</span>
              </FormItem>
              <FormItem label="状态" style={flexV}>
                <span className="ant-form-text" style={{color: running ? '#52c41a' : 'rgba(0, 0, 0, 0.65)'}}>{ running ? '运行中' : '已停止' }</span>
              </FormItem>
            </div>
            <FormItem label="开启扫描" style={{...flex, marginBottom: 0}}>
              <Switch
                  checked={openProxy}
                  onChange={(checked) => this.handleImmediateChange('openProxy', checked)}
              />
            </FormItem>

            <div style={tips}>
              提示: 启动后需要将代理设置为 127.0.0.1:{port} 才能生效
            </div>
          </div>
        </Form>
      </Card>
    );
  }
}

// 使用Form.create()包装组件，注入form属性
const WrappedSettingForm = Form.create()(Setting);

export default WrappedSettingForm;
const flexV = {
  display: 'flex',
  flex: 1
};
const flex = {
  display: 'flex',
};
const tips = {
  color: '#666',
  fontSize: '14px',
  marginTop: '10px',
  padding: '10px',
  background: '#fff8e1',
  borderRadius: '4px',
};

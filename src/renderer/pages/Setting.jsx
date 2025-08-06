import React, { Component } from 'react';
import { Card, Form, Switch,notification} from 'antd';

const FormItem = Form.Item;

const openMessage = (type, text) => {
  notification[type]({
    message: text,
  });
};

class Setting extends Component {
  state = {
    running: false,
    port: 0,
    openProxy: false
  }
  updateStatus = async () => {
    const current = await window.proxyAPI.getStatus()
    console.log('当前代理状态: ', current)
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
      console.log(`${key} 已更新为:`, value);
      if(key === 'openProxy'){
        if(value){
          const success = await window.proxyAPI.start()
          if (success) {
            openMessage('success', '代理启动成功')
            await this.updateStatus()
          } else {
            openMessage('error', '代理启动失败，请查看控制台日志')
          }
        } else {
          const success = await window.proxyAPI.stop()
          if (success) {
            openMessage('info', '代理已停止')
            await this.updateStatus()
          }
        }
      }
    });
  };
  async componentDidMount() {
    console.log('页面注册')
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
            <FormItem label="打开代理" style={{...flex, marginBottom: 0}}>
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

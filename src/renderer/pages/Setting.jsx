import React, { Component } from 'react';
import { Card, Form, Input, Select, Switch, Button, Divider,notification, Icon } from 'antd';

const { Option } = Select;
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
    allowRegister: true,
    enableLog: true,
    openProxy: false
  }
  updateStatus = async () => {
    const current = await window.proxyAPI.getStatus()
    console.log(current)
    this.setState({
      running: current.running,
      port: current.port,
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
    const {getFieldDecorator } = this.props.form;
    const { port, running, openProxy } = this.state;

    return (
      <Card title="系统设置">
        <Form onSubmit={this.handleSubmit}>
            <FormItem label="网站名称">
            {getFieldDecorator('siteName', {
              initialValue: '后台管理系统',
              rules: [{ required: true, message: '请输入网站名称' }],
            })(
              <Input />
            )}
          </FormItem>
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
              提示: 启动后需要将系统代理设置为 127.0.0.1:{port} 才能生效
            </div>
          </div>

          <Divider />

          <FormItem label="默认语言" style={flex}>
            {getFieldDecorator('language', {
              initialValue: 'zh-CN',
            })(
              <Select style={{ width: 120 }}>
                <Option value="zh-CN">简体中文</Option>
                <Option value="en-US">English</Option>
              </Select>
            )}
          </FormItem>
          <div style={flex}>
            <FormItem label="允许注册" style={flexV}>
              {getFieldDecorator('allowRegister', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                  <Switch />
              )}
            </FormItem>

            <FormItem label="开启日志" style={flexV}>
              {getFieldDecorator('enableLog', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                  <Switch />
              )}
            </FormItem>
          </div>
          <Divider />

          <FormItem>
            <Button type="primary" htmlType="submit">保存设置</Button>
            <Button style={{ marginLeft: 8 }}>取消</Button>
          </FormItem>
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

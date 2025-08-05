import React, { Component } from 'react';
import { Card, Form, Input, Select, Switch, Button, Divider } from 'antd';

const { Option } = Select;
const FormItem = Form.Item;

class Setting extends Component {
  // 处理表单提交
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('表单提交的值: ', values);
        // 这里可以添加保存设置的逻辑
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

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

          <FormItem label="默认语言">
            {getFieldDecorator('language', {
              initialValue: 'zh-CN',
            })(
              <Select style={{ width: 120 }}>
                <Option value="zh-CN">简体中文</Option>
                <Option value="en-US">English</Option>
              </Select>
            )}
          </FormItem>

          <FormItem label="是否允许注册">
            {getFieldDecorator('allowRegister', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Switch />
            )}
          </FormItem>

          <FormItem label="是否开启日志">
            {getFieldDecorator('enableLog', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Switch />
            )}
          </FormItem>

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

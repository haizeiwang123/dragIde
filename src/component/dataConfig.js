import React from 'react';
import { Form, Input, Drawer,Button, Switch,Select,Radio,Collapse } from 'antd';
import MonacoEditor from 'react-monaco-editor';
export default class App extends React.Component{
  constructor(props) {
    super(props)
    console.log(props)
    this.formRef = React.createRef();

  }
 
  render() {
   
    return (
      <Drawer
          title="添加数据源"
          placement="right"
          width="560"
          closable={false}
          visible={this.props.showDataConfig}
        >
        <Form ref={this.formRef} labelCol={{span:5, offset: 0}} onFinish={(values)=>{
          this.props.submit(values);
        }}>
          <Form.Item label="数据源名称" value="name">
              <Input placeholder="请输入数据源名称"></Input>
          </Form.Item>
          <Form.Item label="接口地址" value="url">
              <Input placeholder="请输入接口地址"></Input>
          </Form.Item>
          <Form.Item label="请求类型" value="type">
          <Select defaultValue="1">
            <Select.Option value="1">本域请求</Select.Option>
            <Select.Option value="2">跨域请求</Select.Option>
          </Select>
          </Form.Item>
          <Form.Item label="是否初始请求" value="isIni">
              <Switch  />
          </Form.Item>
          <Form.Item label="接口参数" value="param">
              <MonacoEditor
                width={516}
                height={156}
                language="json"
                theme="vs-dark"
                onChange={
                  (value)=>{
                    this.formRef.current.setFieldsValue({
                      param: value,
                    });
                  }
                }
                options={{
                  selectOnLineNumbers: true
                }}
              />
          </Form.Item>

          <Form.Item label="返回值处理函数" value="dataHandle">
              <MonacoEditor
                width={516}
                height={156}
                language="json"
                theme="vs-dark"
                onChange={
                  (value)=>{
                    this.formRef.current.setFieldsValue({
                      dataHandle: value,
                    });
                  }
                }
                options={{
                  selectOnLineNumbers: true
                }}
              />
          </Form.Item>
          <div style={{display:"flex","justifyContent":"flex-end"}}>
            <Button type="primary" htmlType="submit">确定</Button>
            <Button type="dashed" onClick={()=>{this.props.close()}}>取消</Button>
          </div>
        </Form>
        </Drawer>
    )
  }
}



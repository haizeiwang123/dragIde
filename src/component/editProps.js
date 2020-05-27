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
        
        </Drawer>
    )
  }
}


